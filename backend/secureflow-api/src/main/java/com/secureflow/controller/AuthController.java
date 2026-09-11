package com.secureflow.controller;

import com.secureflow.dto.CustomerRegistrationRequest;
import com.secureflow.dto.CustomerRegistrationResponse;
import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.service.AuthService;
import com.secureflow.service.CustomerRegistrationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CustomerRegistrationService customerRegistrationService;

    public AuthController(
            AuthService authService,
            CustomerRegistrationService customerRegistrationService
    ) {
        this.authService = authService;
        this.customerRegistrationService =
                customerRegistrationService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(
                request
        );
    }

    @PostMapping("/register/customer")
    public CustomerRegistrationResponse registerCustomer(
            @RequestBody CustomerRegistrationRequest request
    ) {
        return customerRegistrationService
                .register(request);
    }
}
