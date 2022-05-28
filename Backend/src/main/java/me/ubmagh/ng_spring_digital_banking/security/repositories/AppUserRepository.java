package me.ubmagh.ng_spring_digital_banking.security.repositories;

import me.ubmagh.ng_spring_digital_banking.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, String> {

    AppUser findByUsername(String username);

}
