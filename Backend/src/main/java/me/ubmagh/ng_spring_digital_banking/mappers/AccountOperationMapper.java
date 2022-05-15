package me.ubmagh.ng_spring_digital_banking.mappers;

import me.ubmagh.ng_spring_digital_banking.dtos.AccountOperationDTO;
import me.ubmagh.ng_spring_digital_banking.entities.AccountOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class AccountOperationMapper {

    public AccountOperationDTO fromAccountOperation ( AccountOperation accountOperation){
        AccountOperationDTO accountOperationDTO = new AccountOperationDTO();
        BeanUtils.copyProperties( accountOperation, accountOperationDTO);
        return  accountOperationDTO;
    }


}
