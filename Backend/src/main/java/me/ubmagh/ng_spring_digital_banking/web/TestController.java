package me.ubmagh.ng_spring_digital_banking.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String test(){
        return "OK !👍👍";
    }

}
