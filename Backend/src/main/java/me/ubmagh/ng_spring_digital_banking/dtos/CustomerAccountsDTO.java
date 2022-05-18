package me.ubmagh.ng_spring_digital_banking.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerAccountsDTO {

    private String customerId;
    private int currentPage;
    private int totalPages;
    private int pageSize;
    private List<BankAccountDTO> accounts;

}
