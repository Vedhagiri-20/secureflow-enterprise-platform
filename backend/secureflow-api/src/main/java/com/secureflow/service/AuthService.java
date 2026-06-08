package com.secureflow.service;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return new LoginResponse("Invalid Email", null);
        }

        User user = userOpt.get();

        if (user.getIsActive() != null && !user.getIsActive()) {
            return new LoginResponse("User is inactive", null);
        }

        if (!user.getPasswordHash().equals(request.getPassword())) {
            return new LoginResponse("Invalid Password", null);
        }

        return new LoginResponse(
                "Login Successful",
                user.getRole().getRoleName()
        );
    }
}