package me.ubmagh.ng_spring_digital_banking.services;

import me.ubmagh.ng_spring_digital_banking.dtos.AccountHistoryDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.OperationNotFoundException;

import java.util.List;

public interface AccountOperationService {

    public List<AccountOperationDTO> getAccountOperationsHistory(String accountId);

    public AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundExcetion;


    AccountOperationDTO getOperation(long operationId) throws OperationNotFoundException;
}
