package me.ubmagh.ng_spring_digital_banking.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerAccountsDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerDTO;
import me.ubmagh.ng_spring_digital_banking.dtos.CustomerPageableDTO;
import me.ubmagh.ng_spring_digital_banking.exceptions.CustomerNotFoundException;
import me.ubmagh.ng_spring_digital_banking.services.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api")
@CrossOrigin("*")
public class CustomerRestController {

    private CustomerService customerService;

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers")
    public List<CustomerDTO> getCustomers(){
        return customerService.listCustomers();
    }

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers/paginated")
    public CustomerPageableDTO getPaginatedCustomers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ){
        return customerService.paginateCustomers( page, size);
    }

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers/paginated/search")
    public CustomerPageableDTO searchCustomersPaginated( @RequestParam(name = "keyword", defaultValue = "") String keyword,
                                                         @RequestParam(name = "page", defaultValue = "0") int page,
                                                         @RequestParam(name = "size", defaultValue = "10") int size){
        return customerService.searchCustomerPaginated( page, size, keyword);
    }

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers/search")
    public List<CustomerDTO> getCustomers( @RequestParam(name = "keyword", defaultValue = "") String keyword ){
        return customerService.searchCustomer( keyword);
    }

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers/{id}")
    public CustomerDTO getCustomer( @PathVariable(name="id") String customerId) throws CustomerNotFoundException {
         return customerService.getCustomer( customerId);
    }

    @PostAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/customers")
    public CustomerDTO saveCustomer( @RequestBody CustomerDTO request){
        return customerService.saveCustomer( request);
    }

    @PostAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/customers/{id}")
    public CustomerDTO updateCustomer( @PathVariable(name="id") String customerId, @RequestBody CustomerDTO request) throws CustomerNotFoundException {
        request.setId( customerId);
        return customerService.updateCustomer( request);
    }

    @PostAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable(name="id") String customerId){
        customerService.deleteCustomer( customerId);
    }

    @PostAuthorize("hasAuthority('USER')")
    @GetMapping("/customers/{id}/accounts")
    public CustomerAccountsDTO getCustomer(@PathVariable(name="id") String customerId,
                                           @RequestParam(name = "page", defaultValue = "0") int page,
                                           @RequestParam(name = "size", defaultValue = "10") int size)
            throws CustomerNotFoundException {
        return customerService.getCustomerAccounts( customerId, page, size);
    }

}
