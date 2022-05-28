package me.ubmagh.ng_spring_digital_banking.security.service;

import me.ubmagh.ng_spring_digital_banking.security.entities.AppRole;
import me.ubmagh.ng_spring_digital_banking.security.entities.AppUser;

import java.util.List;

public interface SecurityService {

    AppUser addNewUser( AppUser appUser);
    AppRole addNewRole( AppRole appRole);
    void addRoleToUser( String username, String roleName);
    AppUser loadUserByUsername( String username);
    List<AppUser> listUsers();
}
