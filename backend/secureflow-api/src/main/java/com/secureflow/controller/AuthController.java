package com.secureflow.controller;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}