package me.ubmagh.ng_spring_digital_banking.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountHistoryDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.entities.AccountOperation;
import me.ubmagh.ng_spring_digital_banking.entities.BankAccount;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.OperationNotFoundException;
import me.ubmagh.ng_spring_digital_banking.mappers.AccountOperationMapper;
import me.ubmagh.ng_spring_digital_banking.repositories.AccountOperationRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.BankAccountRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class AccountOperationServiceImpl implements AccountOperationService {

    private AccountOperationRepository operationRepository;
    private AccountOperationMapper accountOperationMapper;
    private BankAccountRepository accountRepository;


    @Override
    public List<AccountOperationDTO> getAccountOperationsHistory(String accountId){
        List<AccountOperation> bankAccountOperations = operationRepository.findByBankAccountId(accountId);
        List<AccountOperationDTO> accountOperationDTOS = bankAccountOperations.stream().map(accountOperation -> accountOperationMapper.fromAccountOperation(accountOperation)).collect(Collectors.toList());
        return accountOperationDTOS;
    }

    @Override
    public AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundExcetion {
        BankAccount bankAccount = accountRepository.findById( accountId).orElseThrow( ()-> new BankAccountNotFoundExcetion("Bank account not Found !"));
        Page<AccountOperation> accountOperations = operationRepository.findByBankAccountId(accountId, PageRequest.of(page, size));

        AccountHistoryDTO accountHistoryDTO = new AccountHistoryDTO();
        List<AccountOperationDTO> operations = accountOperations.getContent().stream().map( accountOperation -> accountOperationMapper.fromAccountOperation(accountOperation) ).collect(Collectors.toList());
        accountHistoryDTO.setAccountOperationDTOS( operations );
        accountHistoryDTO.setAccountId( bankAccount.getId() );
        accountHistoryDTO.setBalance( bankAccount.getBalance() );
        accountHistoryDTO.setPageSize( size );
        accountHistoryDTO.setCurrentPage( page );
        accountHistoryDTO.setTotalPages(accountOperations.getTotalPages() );
        return accountHistoryDTO;
    }

    @Override
    public AccountOperationDTO getOperation( long operationId) throws OperationNotFoundException {
        return this.accountOperationMapper.fromAccountOperation( this.operationRepository.findById( operationId).orElseThrow( ()->  new OperationNotFoundException("Operation with id '"+operationId+"' wasn't found !") ) );
    }
}
