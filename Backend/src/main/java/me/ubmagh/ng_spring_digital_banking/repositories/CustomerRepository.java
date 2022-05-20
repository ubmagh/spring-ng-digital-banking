package me.ubmagh.ng_spring_digital_banking.repositories;

import me.ubmagh.ng_spring_digital_banking.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    @Query(" SELECT C FROM Customer C WHERE C.name LIKE :kw")
    List<Customer> searchCustomerByName(@Param("kw") String keyword);

    @Query(" SELECT C FROM Customer C WHERE C.name LIKE :kw")
    Page<Customer> searchCustomerByNamePaginated(@Param("kw") String keyword, Pageable pageable);



}
