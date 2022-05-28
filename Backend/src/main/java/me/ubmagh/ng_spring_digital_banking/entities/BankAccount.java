package me.ubmagh.ng_spring_digital_banking.entities;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.ubmagh.ng_spring_digital_banking.enums.AccountStatus;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", length = 7, discriminatorType = DiscriminatorType.STRING)
public class BankAccount { // this class should be abstract in case of  "table per class" strategy !!

    @Id
    private String id;

    private double balance;

    private Date createdAt;

    @ManyToOne
    private Customer customer;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<AccountOperation> accountAccountOperations = new ArrayList<>();

}
