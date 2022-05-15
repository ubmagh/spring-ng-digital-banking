package me.ubmagh.ng_spring_digital_banking.services;


import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.entities.BankAccount;
import me.ubmagh.ng_spring_digital_banking.entities.CurrentAccount;
import me.ubmagh.ng_spring_digital_banking.entities.Customer;
import me.ubmagh.ng_spring_digital_banking.entities.SavingAccount;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {

    Customer saveCustomer( Customer customer);

    CustomerDTO saveCustomer(CustomerDTO customerDTO);

    CurrentAccount saveCurrentBankAccount(double initialBalance, double overDraft, String customerId) throws CustomerNotFoundException;

    SavingAccount saveSavingBankAccount(double initialBalance, double interestRate, String customerId) throws CustomerNotFoundException;

    List<CustomerDTO> listCustomers();

    BankAccount getBankAccount( String bankAccountId) throws BankAccountNotFoundExcetion;

    void debit( String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException;

    void credit( String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException;

    void transfer( String accountSourceId, String accountDestinationId, double amount) throws BankAccountNotFoundExcetion, BalanceNotSufficientException;

    List<BankAccount> listBankAccount();

}
