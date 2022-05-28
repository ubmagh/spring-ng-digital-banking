package me.ubmagh.ng_spring_digital_banking.security.service;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.security.entities.AppRole;
import me.ubmagh.ng_spring_digital_banking.security.entities.AppUser;
import me.ubmagh.ng_spring_digital_banking.security.repositories.AppRoleRepository;
import me.ubmagh.ng_spring_digital_banking.security.repositories.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@AllArgsConstructor
public class SecurityServiceImpl implements SecurityService {

    private AppUserRepository userRepository;
    private AppRoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;


    @Override
    public AppUser addNewUser(AppUser appUser) {
        appUser.setId(UUID.randomUUID().toString());
        appUser.setPassword( passwordEncoder.encode( appUser.getPassword() ) );
        return userRepository.save( appUser);
    }

    @Override
    public AppRole addNewRole(AppRole appRole) {
        return roleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username,String roleName){
        AppUser appUser = userRepository.findByUsername(username);
        AppRole appRole = roleRepository.findByRoleName(roleName);
        appUser.getRoles().add( appRole );
    }


    @Override
    public AppUser loadUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    @Override
    public List<AppUser>listUsers(){
        return userRepository.findAll();
    }
}
