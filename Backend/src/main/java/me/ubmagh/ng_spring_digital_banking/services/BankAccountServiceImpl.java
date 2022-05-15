package me.ubmagh.ng_spring_digital_banking.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.BankAccountDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.CurrentBankAccountDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.SavingBankAccountDTO;
import me.ubmagh.ng_spring_digital_banking.entities.*;
import me.ubmagh.ng_spring_digital_banking.enums.OperationType;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.mappers.BankAccountMapper;
import me.ubmagh.ng_spring_digital_banking.mappers.CustomerMapper;
import me.ubmagh.ng_spring_digital_banking.repositories.AccountOperationRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.BankAccountRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.CustomerRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j // equals adding this line :     private Logger log = LoggerFactory.getLogger(this.getClass());
public class BankAccountServiceImpl implements BankAccountService {

    private CustomerRepository customerRepository;
    private BankAccountRepository accountRepository;
    private AccountOperationRepository operationRepository;
    private CustomerMapper customerMapper;
    private BankAccountMapper bankAccountMapper;

    @Override
    public Customer saveCustomer(Customer customer) {
        log.info("⌛ saving customer... ");
        customer.setId(UUID.randomUUID().toString());
        Customer savedCustomer = customerRepository.save(customer);
        log.info("✔ customer saved ");
        return savedCustomer;
    }

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        log.info("⌛ saving customer... ");
        customerDTO.setId(UUID.randomUUID().toString());
        Customer customer = customerMapper.fromCustomerDto( customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        log.info("✔ customer saved ");
        return customerMapper.fromCustomer(savedCustomer);
    }

    @Override
    public CurrentBankAccountDTO saveCurrentBankAccount(double initialBalance, double overDraft, String customerId) throws CustomerNotFoundException {
        log.info("⌛ Checking if customer exists... ");
        Customer customer = customerRepository.findById( customerId ).orElse(null);
        if( customer==null )
            throw new CustomerNotFoundException(" Customer not found !! ");
        log.info("✔ Customer found !");

        CurrentAccount currentBankAccount;
        log.info("⌛ creating Current-bank-account ... ");
        currentBankAccount = new CurrentAccount();
        currentBankAccount.setId( UUID.randomUUID().toString() );
        currentBankAccount.setCreatedAt( new Date() );
        currentBankAccount.setBalance( initialBalance );
        currentBankAccount.setCustomer( customer );
        currentBankAccount.setOverDraft( overDraft );

        CurrentAccount savedBankAccount = accountRepository.save(currentBankAccount);
        log.info("✔ Current-bank-account created !");
        return bankAccountMapper.fromCurrentAccount(savedBankAccount);
    }

    @Override
    public SavingBankAccountDTO saveSavingBankAccount(double initialBalance, double interestRate, String customerId) throws CustomerNotFoundException{
        log.info("⌛ Checking if customer exists... ");
        Customer customer = customerRepository.findById( customerId ).orElse(null);
        if( customer==null )
            throw new CustomerNotFoundException(" Customer not found !! ");
        log.info("✔ Customer found !");

        SavingAccount savingBankAccount;
        log.info("⌛ creating Saving-bank-account ... ");
        savingBankAccount = new SavingAccount();
        savingBankAccount.setId( UUID.randomUUID().toString() );
        savingBankAccount.setCreatedAt( new Date() );
        savingBankAccount.setBalance( initialBalance );
        savingBankAccount.setCustomer( customer );
        savingBankAccount.setInterestRate( interestRate );

        SavingAccount savedBankAccount = accountRepository.save(savingBankAccount);
        log.info("✔ Saving-bank-account created !");
        return bankAccountMapper.fromSavingAccount( savingBankAccount );
    }

    @Override
    public List<CustomerDTO> listCustomers() {
        log.info("✔ Got the list of customers !");
        List<Customer> customers = customerRepository.findAll();
        List<CustomerDTO> customerDTOS = customers.stream().map(customer -> customerMapper.fromCustomer(customer)).collect(Collectors.toList());
        return customerDTOS;
    }

    @Override
    public BankAccountDTO getBankAccount(String bankAccountId) throws BankAccountNotFoundExcetion {
        BankAccount bankAccount = accountRepository.findById( bankAccountId ).orElseThrow(() -> new BankAccountNotFoundExcetion("Bank account not found !"));
        log.info("✔ bank account found and returned !");
        if (bankAccount instanceof SavingAccount)
            return bankAccountMapper.fromSavingAccount( (SavingAccount) bankAccount );
        return bankAccountMapper.fromCurrentAccount( (CurrentAccount) bankAccount );
    }

    @Override
    public void debit(String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {
        BankAccount bankAccount = accountRepository.findById( accountId ).orElseThrow(() -> new BankAccountNotFoundExcetion("Bank account not found !"));
        log.info("⏳ debiting bank account ...");
        if( bankAccount.getBalance()<amount )
            throw new BalanceNotSufficientException("Balance not sufficient for transaction !");
        AccountOperation operation = new AccountOperation();
        operation.setType( OperationType.DEBIT);
        operation.setAmount( amount );
        operation.setOperationDate( new Date() );
        operation.setDescription( description );
        operation.setBankAccount( bankAccount );
        operationRepository.save( operation );
        bankAccount.setBalance( bankAccount.getBalance()-amount );
        accountRepository.save( bankAccount );
        log.info("✔ account debited !");
    }

    @Override
    public void credit(String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {
        BankAccount bankAccount = accountRepository.findById( accountId ).orElseThrow(() -> new BankAccountNotFoundExcetion("Bank account not found !"));
        log.info("⏳ crediting bank account ...");

        AccountOperation operation = new AccountOperation();
        operation.setType( OperationType.DEBIT);
        operation.setAmount( amount );
        operation.setOperationDate( new Date() );
        operation.setDescription( description );
        operation.setBankAccount( bankAccount );
        operationRepository.save( operation );
        bankAccount.setBalance( bankAccount.getBalance()+amount );
        accountRepository.save( bankAccount );
        log.info("✔ account credited !");
    }

    @Override
    public void transfer(String accountSourceId, String accountDestinationId, double amount) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {
        debit( accountSourceId, amount, "Transfer to ("+accountDestinationId+")" );
        credit( accountDestinationId, amount, "Transfer from ("+accountSourceId+")"  );
    }

    @Override
    public  List<BankAccount> listBankAccount(){
        return accountRepository.findAll();
    }

    @Override
    public  List<BankAccountDTO> listBankAccountDto(){
        List<BankAccount> bankAccounts = accountRepository.findAll();
        List<BankAccountDTO> bankAccountDTOS = bankAccounts.stream().map(bankAccount -> {
            if (bankAccount instanceof SavingAccount)
                return bankAccountMapper.fromSavingAccount((SavingAccount) bankAccount);
            return bankAccountMapper.fromCurrentAccount((CurrentAccount) bankAccount);
        }).collect(Collectors.toList());
        return bankAccountDTOS;
    }

    @Override
    public CustomerDTO getCustomer(String customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new CustomerNotFoundException("Customer Not found !"));
        return customerMapper.fromCustomer( customer);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) throws CustomerNotFoundException {
        log.info("⌛ updating customer... ");
        customerRepository.findById( customerDTO.getId()).orElseThrow(()-> new CustomerNotFoundException("Customer Not Found !"));
        Customer customer = customerMapper.fromCustomerDto( customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        log.info("✔ customer updated ");
        return customerMapper.fromCustomer(savedCustomer);
    }

    @Override
    public void deleteCustomer(String customerId) {
        log.info("⌛ deleting customer... ");
        customerRepository.deleteById(customerId);
        log.info("✔ customer deleted ");
    }



}
