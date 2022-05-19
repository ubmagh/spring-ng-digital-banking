package me.ubmagh.ng_spring_digital_banking.dtos;


import lombok.Data;
import me.ubmagh.ng_spring_digital_banking.enums.AccountStatus;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Date;


@Data
public class SavingBankAccountDTO extends BankAccountDTO {

    private String id;

    private double balance;

    private Date createdAt;

    private CustomerDTO customer;

    private AccountStatus status;

    private double interestRate;

}
