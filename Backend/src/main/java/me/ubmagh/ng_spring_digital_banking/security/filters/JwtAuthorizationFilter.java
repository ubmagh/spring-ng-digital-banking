package me.ubmagh.ng_spring_digital_banking.security.filters;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.security.config.Jwt_config;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;


@Slf4j
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if( request.getServletPath().equals( Jwt_config.REFRESH_PATH)){ // is it a refreshing ?
            filterChain.doFilter(request, response);
            return ;
        }
        String jwt_token = request.getHeader(Jwt_config.AUTHORIZATION_HEADER);
        if( jwt_token!=null && jwt_token.startsWith(Jwt_config.TOKEN_HEADER_PREFIX) ){ // does it have a passport, jwt will take care of it
            try{
                String jwt = jwt_token.substring(7);
                Algorithm algorithm = Algorithm.HMAC256(Jwt_config.SECRET_PHRASE);
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(jwt);

                String username= decodedJWT.getSubject();
                String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                Collection<GrantedAuthority> authorities = Arrays.stream(roles).map(SimpleGrantedAuthority::new).collect(Collectors.toList()) ;
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken( username, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(token);

                filterChain.doFilter(request, response);
            }catch (Exception e){
                response.setHeader("error",e.getMessage());
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
            }
        }else{
            filterChain.doFilter(request, response); // spring security authorization
        }
    }
}
