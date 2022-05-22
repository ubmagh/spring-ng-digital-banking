package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.CreditDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.DebitDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.TransferRequestDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.OperationNotFoundException;
import me.ubmagh.ng_spring_digital_banking.services.AccountOperationService;
import me.ubmagh.ng_spring_digital_banking.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
@CrossOrigin("*")
public class OperationRestController {


    private AccountOperationService operationService;
    private BankAccountService accountService;

    @GetMapping("/operations/{id}")
    public AccountOperationDTO getOperation( @PathVariable("id") long operationId) throws OperationNotFoundException {
        return operationService.getOperation( operationId);
    }

    @PostMapping("/operations/debit")
    public DebitDTO debiter( @RequestBody DebitDTO debitDTO) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {

        accountService.debit( debitDTO.getAccountId(), debitDTO.getAmount(), debitDTO.getDescription() );
        return debitDTO;

    }

    @PostMapping("/operations/credit")
    public CreditDTO credit(@RequestBody CreditDTO creditDTO) throws BankAccountNotFoundExcetion {

        accountService.credit( creditDTO.getAccountId(), creditDTO.getAmount(), creditDTO.getDescription() );
        return creditDTO;

    }


    @PostMapping("/operations/transfer")
    public TransferRequestDTO transferer(@RequestBody TransferRequestDTO transferRequestDTO) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {

        accountService.transfer(
                transferRequestDTO.getAccountSourceId(),
                transferRequestDTO.getAccountDestinationId(),
                transferRequestDTO.getAmount(),
                transferRequestDTO.getDescription()
        );
        return transferRequestDTO;

    }


}
