package me.ubmagh.ng_spring_digital_banking.security.repositories;

import me.ubmagh.ng_spring_digital_banking.security.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppRoleRepository extends JpaRepository<AppRole, Long> {

    AppRole findByRoleName( String roleName);
}
