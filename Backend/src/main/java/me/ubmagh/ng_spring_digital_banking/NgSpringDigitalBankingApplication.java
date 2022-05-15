package me.ubmagh.ng_spring_digital_banking;

import com.github.javafaker.Faker;
import me.ubmagh.ng_spring_digital_banking.entities.*;
import me.ubmagh.ng_spring_digital_banking.enums.AccountStatus;
import me.ubmagh.ng_spring_digital_banking.enums.OperationType;
import me.ubmagh.ng_spring_digital_banking.exceptions.BalanceNotSufficientException;
import me.ubmagh.ng_spring_digital_banking.exceptions.BankAccountNotFoundExcetion;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.repositories.BankAccountRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.CustomerRepository;
import me.ubmagh.ng_spring_digital_banking.repositories.AccountOperationRepository;
import me.ubmagh.ng_spring_digital_banking.services.BankAccountService;
import me.ubmagh.ng_spring_digital_banking.services.BankService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class NgSpringDigitalBankingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NgSpringDigitalBankingApplication.class, args);
	}

	//@Bean
	CommandLineRunner fillDbUsingBAService(BankAccountService bankAccountService){
		return  args -> {
			Faker faker = new Faker();

			for( int i=0; i<13; i++){
				Customer customer = new Customer();
				customer.setId(UUID.randomUUID().toString());
				customer.setName( faker.name().fullName() );
				customer.setEmail( faker.internet().safeEmailAddress() );
				bankAccountService.saveCustomer( customer );
			}


			bankAccountService.listCustomers().forEach(customer -> {

				try {
					bankAccountService.saveCurrentBankAccount(
							faker.number().randomDouble(2, 10, 9999999),
							faker.number().randomDouble(2, 500, 9000),
							customer.getId()
					);

					bankAccountService.saveSavingBankAccount(
							faker.number().randomDouble(2, 10, 9999999),
							faker.number().randomDouble(2, 0, 100),
							customer.getId()
					);

					for(BankAccount account: bankAccountService.listBankAccount()){

						for( int i=0; i<faker.random().nextInt(8,11); i++){
								bankAccountService.credit( account.getId(), 17*faker.number().randomDouble(2, 111, 1111), "Crédit !" );
							bankAccountService.debit( account.getId(), 17*faker.number().randomDouble(2, 111, 1111), "Débit !" );
						}

					};
				} catch (CustomerNotFoundException|BankAccountNotFoundExcetion|BalanceNotSufficientException  e) {
					e.printStackTrace();
				}


			});


		};
	}


	// @Bean
	CommandLineRunner testingFunction(BankService bankService){
		return args -> {
			bankService.consulter();
		};
	}


	// @Bean
	CommandLineRunner fillDbUsingRepos(
			CustomerRepository customerRepository,
			BankAccountRepository bankAccountRepository,
			AccountOperationRepository accountOperationRepository
	){
		return args -> {

			Faker faker = new Faker();

			for( int i=0; i<13; i++){
				Customer customer = new Customer();
				customer.setId(UUID.randomUUID().toString());
				customer.setName( faker.name().fullName() );
				customer.setEmail( faker.internet().safeEmailAddress() );
				customerRepository.save( customer );
			}

			 customerRepository.findAll().forEach(customer -> {
				 CurrentAccount currentAccount = new CurrentAccount();
				 currentAccount.setId( UUID.randomUUID().toString() );
				 currentAccount.setCustomer( customer);
				 currentAccount.setBalance( faker.number().randomDouble(2, 10, 9999999) );
				 currentAccount.setCreatedAt( faker.date().past( 600, TimeUnit.DAYS) );
				 currentAccount.setStatus( AccountStatus.CREATED);
				 currentAccount.setOverDraft( faker.number().randomDouble(2, 500, 9000) );
				 bankAccountRepository.save( currentAccount );

				 SavingAccount savingAccount = new SavingAccount();
				 savingAccount.setId( UUID.randomUUID().toString() );
				 savingAccount.setCustomer( customer);
				 savingAccount.setBalance( faker.number().randomDouble(2, 10, 9999999) );
				 savingAccount.setCreatedAt( faker.date().past( 800, TimeUnit.DAYS) );
				 savingAccount.setStatus( AccountStatus.CREATED);
				 savingAccount.setInterestRate( faker.number().randomDouble(2, 0, 100) );
				 bankAccountRepository.save( savingAccount );
			 });


			bankAccountRepository.findAll().forEach( bankAccount -> {

				for( int i=0; i<faker.random().nextInt(3,6); i++){
					AccountOperation accountOperation = new AccountOperation();
					accountOperation.setAmount( faker.number().randomDouble(2, 100, 15000));
					accountOperation.setOperationDate( faker.date().past( 200, TimeUnit.DAYS) );
					accountOperation.setBankAccount( bankAccount);
					accountOperation.setType( faker.options().option(OperationType.class) );
					accountOperationRepository.save( accountOperation );
				}

			});

		};
	}

}
