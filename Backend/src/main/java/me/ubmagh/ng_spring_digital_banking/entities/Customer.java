package me.ubmagh.ng_spring_digital_banking.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Customer {

    @Id
    private String id;

    private String name;

    private String email;

    @OneToMany(mappedBy = "customer")
    private List<BankAccount> bankAccounts;
}
