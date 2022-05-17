package me.ubmagh.ng_spring_digital_banking.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditDTO {

    private String accountId;
    private double amount;
    private String description;
    

}
