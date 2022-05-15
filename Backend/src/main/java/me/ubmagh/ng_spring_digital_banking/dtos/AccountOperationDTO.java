package me.ubmagh.ng_spring_digital_banking.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.ubmagh.ng_spring_digital_banking.enums.OperationType;

import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountOperationDTO {
    private long id;
    private Date operationDate;
    private double amount;
    private OperationType type;
    private String description;
}
