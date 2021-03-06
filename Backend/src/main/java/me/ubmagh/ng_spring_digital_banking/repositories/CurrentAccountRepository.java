package me.ubmagh.ng_spring_digital_banking.repositories;

import me.ubmagh.ng_spring_digital_banking.entities.CurrentAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrentAccountRepository extends JpaRepository<CurrentAccount, String> {
}
