package me.ubmagh.ng_spring_digital_banking.services;

import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.entities.Customer;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;

import java.util.List;

public interface CustomerService {

    Customer saveCustomer(Customer customer);

    CustomerDTO saveCustomer(CustomerDTO customerDTO);

    List<CustomerDTO> listCustomers();

    CustomerDTO getCustomer(String customerId) throws CustomerNotFoundException;

    CustomerDTO updateCustomer(CustomerDTO customerDTO) throws CustomerNotFoundException;

    void deleteCustomer(String customerId);

    List<CustomerDTO> searchCustomer( String searchKeyword);

}
