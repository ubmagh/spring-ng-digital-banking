package me.ubmagh.ng_spring_digital_banking.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.entities.*;
import me.ubmagh.ng_spring_digital_banking.enums.OperationType;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.repositories.AccountOperationRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.BankAccountRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.CustomerRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
@Slf4j // equals adding this line :     private Logger log = LoggerFactory.getLogger(this.getClass());
public class BankAccountServiceImpl implements BankAccountService {

    private CustomerRepository customerRepository;
    private BankAccountRepository accountRepository;
    private AccountOperationRepository operationRepository;

    @Override
    public Customer saveCustomer(Customer customer) {
        log.info("⌛ saving customer... ");
        customer.setId(UUID.randomUUID().toString());
        Customer savedCustomer = customerRepository.save(customer);
        log.info("✔ customer saved ");
        return savedCustomer;
    }

    @Override
    public CurrentAccount saveCurrentBankAccount(double initialBalance, double overDraft, String customerId) throws CustomerNotFoundException {
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
        return savedBankAccount;
    }

    @Override
    public SavingAccount saveSavingBankAccount(double initialBalance, double interestRate, String customerId) throws CustomerNotFoundException{
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
        return savedBankAccount;
    }

    @Override
    public List<Customer> listCustomers() {
        log.info("✔ Got the list of customers !");
        return customerRepository.findAll();
    }

    @Override
    public BankAccount getBankAccount(String bankAccountId) throws BankAccountNotFoundExcetion {
        BankAccount bankAccount = accountRepository.findById( bankAccountId ).orElseThrow(() -> new BankAccountNotFoundExcetion("Bank account not found !"));
        log.info("✔ bank account found and returned !");
        return bankAccount;
    }

    @Override
    public void debit(String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException {
        BankAccount bankAccount = getBankAccount( accountId);
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
        BankAccount bankAccount = getBankAccount( accountId);
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
}
