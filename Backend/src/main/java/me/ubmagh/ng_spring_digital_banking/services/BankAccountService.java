package me.ubmagh.ng_spring_digital_banking.services;


import me.ubmagh.ng_spring_digital_banking.dtos.*;
import me.ubmagh.ng_spring_digital_banking.entities.BankAccount;
import me.ubmagh.ng_spring_digital_banking.entities.CurrentAccount;
import me.ubmagh.ng_spring_digital_banking.entities.SavingAccount;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;

import java.util.List;


public interface BankAccountService {


    CurrentBankAccountDTO saveCurrentBankAccount(double initialBalance, double overDraft, String customerId) throws CustomerNotFoundException;

    BankAccountDTO updateCurrentBankAccount(CurrentAccount currentAccount) throws BankAccountNotFoundExcetion;

    SavingBankAccountDTO saveSavingBankAccount(double initialBalance, double interestRate, String customerId) throws CustomerNotFoundException;


    BankAccountDTO updateSavingBankAccount(SavingAccount savingAccount) throws BankAccountNotFoundExcetion;

    BankAccountDTO getBankAccount(String bankAccountId) throws BankAccountNotFoundExcetion;

    void debit( String accountId, double amount, String description) throws BankAccountNotFoundExcetion, BalanceNotSufficientException;

    void credit( String accountId, double amount, String description) throws BankAccountNotFoundExcetion;

    void transfer( String accountSourceId, String accountDestinationId, double amount) throws BankAccountNotFoundExcetion, BalanceNotSufficientException;

    List<BankAccount> listBankAccount();

    List<BankAccountDTO> listBankAccountDto();

}
