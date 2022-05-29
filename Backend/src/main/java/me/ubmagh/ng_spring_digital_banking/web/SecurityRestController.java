package me.ubmagh.ng_spring_digital_banking.web;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.security.config.Jwt_config;
import me.ubmagh.ng_spring_digital_banking.security.entities.AppRole;
import me.ubmagh.ng_spring_digital_banking.security.entities.AppUser;
import me.ubmagh.ng_spring_digital_banking.security.service.SecurityService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@Slf4j
@AllArgsConstructor
@CrossOrigin("*")
public class SecurityRestController {

    private SecurityService securityService;

    @GetMapping( "/api/refresh-token" )
    public void refreshToken( HttpServletRequest request, HttpServletResponse response) throws Exception {
        String jwt_token = request.getHeader(Jwt_config.AUTHORIZATION_HEADER);
        if( jwt_token!=null && jwt_token.startsWith(Jwt_config.TOKEN_HEADER_PREFIX) ){
            try{
                String jwt = jwt_token.substring(7);
                Algorithm algorithm = Algorithm.HMAC256(Jwt_config.SECRET_PHRASE);
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(jwt);

                String username= decodedJWT.getSubject();
                AppUser user = securityService.loadUserByUsername(username);

                String jwtAccessToken= JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis()+Jwt_config.ACCESS_TOKEN_EXPIRATION)) // 2mins
                        .withIssuer(request.getRequestURL().toString())
                        .withClaim("roles", user.getRoles().stream().map(AppRole::getRoleName).collect(Collectors.toList()))
                        .sign( algorithm);

                Map<String, String> tokens = new HashMap<>();
                tokens.put("access_token", jwtAccessToken);
                tokens.put("refresh_token", jwt);
                response.setContentType("application/json");
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);


            }catch (Exception e){
                throw e;
            }
        }else
            throw new RuntimeException(" Refresh token is required !!! ");
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/api/profile")
    public AppUser getUser(Principal principal){
        return securityService.loadUserByUsername( principal.getName() );
    }

}
