package me.ubmagh.ng_spring_digital_banking.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.ubmagh.ng_spring_digital_banking.enums.OperationType;

import javax.persistence.*;
import java.util.Date;



@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountOperation {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date operationDate;

    private double amount;

    @Enumerated(EnumType.STRING)
    private OperationType type;

    @ManyToOne
    private BankAccount bankAccount;
}
