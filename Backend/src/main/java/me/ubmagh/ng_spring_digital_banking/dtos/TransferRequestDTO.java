package me.ubmagh.ng_spring_digital_banking.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransferRequestDTO {

    private String accountSourceId;

    private String accountDestinationId;

    private double amount;

    private String description;


}


