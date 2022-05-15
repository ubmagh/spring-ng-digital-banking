package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountHistoryDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.BankAccountDTO;
import me.ubmagh.ng_spring_digital_banking.entities.BankAccount;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.services.BankAccountService;
import me.ubmagh.ng_spring_digital_banking.services.BankService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
public class BankAccountRestController {

    private BankAccountService bankAccountService;

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
        return bankAccountService.getAccountOperationsHistory( accountId);
    }

    @GetMapping("/accounts/{accountId}/paginateOperations")
    public AccountHistoryDTO getAccountHistory(
            @PathVariable("accountId") String accountId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) throws BankAccountNotFoundExcetion {
        return bankAccountService.getAccountHistory( accountId, page, size);
    }



}
