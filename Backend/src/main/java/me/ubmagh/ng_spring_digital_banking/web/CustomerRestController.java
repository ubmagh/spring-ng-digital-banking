package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.services.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
public class CustomerRestController {

    private CustomerService customerService;

    @GetMapping("/customers")
    public List<CustomerDTO> getCustomers(){
        return customerService.listCustomers();
    }

    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomer( @PathVariable(name="id") String customerId) throws CustomerNotFoundException {
         return customerService.getCustomer( customerId);
    }

    @PostMapping("/customers")
    public CustomerDTO saveCustomer( @RequestBody CustomerDTO request){
        return customerService.saveCustomer( request);
    }

    @PutMapping("/customers/{id}")
    public CustomerDTO updateCustomer( @PathVariable(name="id") String customerId, @RequestBody CustomerDTO request) throws CustomerNotFoundException {
        request.setId( customerId);
        return customerService.updateCustomer( request);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable(name="id") String customerId){
        customerService.deleteCustomer( customerId);
    }

}
