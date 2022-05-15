package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
public class CustomerRestController {

    private BankAccountService bankAccountService;

    @GetMapping("/customers")
    public List<CustomerDTO> getCustomers(){
        return bankAccountService.listCustomers();
    }

    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomer( @PathVariable(name="id") String customerId) throws CustomerNotFoundException {
         return bankAccountService.getCustomer( customerId);
    }

    @PostMapping("/customers")
    public CustomerDTO saveCustomer( @RequestBody CustomerDTO request){
        return bankAccountService.saveCustomer( request);
    }

    @PutMapping("/customers/{id}")
    public CustomerDTO updateCustomer( @PathVariable(name="id") String customerId, @RequestBody CustomerDTO request) throws CustomerNotFoundException {
        request.setId( customerId);
        return bankAccountService.updateCustomer( request);
    }

    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable(name="id") String customerId){
        bankAccountService.deleteCustomer( customerId);
    }

}
