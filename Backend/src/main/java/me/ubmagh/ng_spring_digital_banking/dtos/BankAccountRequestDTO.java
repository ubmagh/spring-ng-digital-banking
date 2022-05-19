package me.ubmagh.ng_spring_digital_banking.dtos;


import lombok.Data;
import me.ubmagh.ng_spring_digital_banking.enums.AccountStatus;

import java.util.Date;


@Data
public class BankAccountRequestDTO  {

    private String id;

    private double balance;

    private Date createdAt;

    private CustomerDTO customer;


    private double overDraft;

    private String type;

    private double interestRate;

}
