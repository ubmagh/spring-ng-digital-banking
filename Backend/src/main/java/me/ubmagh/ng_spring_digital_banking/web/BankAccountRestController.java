package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountHistoryDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.BankAccountDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.services.AccountOperationService;
import me.ubmagh.ng_spring_digital_banking.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
@CrossOrigin("*")
public class BankAccountRestController {

    private BankAccountService bankAccountService;
    private AccountOperationService operationService;

    @GetMapping("/accounts/{accountId}")
    public BankAccountDTO getBankAccount( @PathVariable("accountId") String accountId) throws BankAccountNotFoundExcetion {
        return bankAccountService.getBankAccount( accountId);
    }

    @GetMapping("/accounts")
    public List<BankAccountDTO> accountsList( ){
        return bankAccountService.listBankAccountDto();
    }

    @GetMapping("/accounts/{accountId}/operations")
    public List<AccountOperationDTO> getHistory( @PathVariable("accountId") String accountId ){
        return operationService.getAccountOperationsHistory( accountId);
    }

    @GetMapping("/accounts/{accountId}/paginateOperations")
    public AccountHistoryDTO getAccountHistory(
            @PathVariable("accountId") String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) throws BankAccountNotFoundExcetion {
        return operationService.getAccountHistory( accountId, page, size);
    }



}
