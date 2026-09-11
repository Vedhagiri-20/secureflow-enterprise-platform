package com.secureflow.service;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import com.secureflow.security.JwtService;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            return new LoginResponse(
                    "Email and password are required",
                    null
            );
        }

        String email =
                request.getEmail().trim();

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return new LoginResponse(
                    "Invalid Email",
                    null
            );
        }

        User user =
                userOptional.get();

        if (Boolean.FALSE.equals(
                user.getIsActive()
        )) {
            return new LoginResponse(
                    "User is inactive",
                    null
            );
        }

        if (!passwordMatches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            return new LoginResponse(
                    "Invalid Password",
                    null
            );
        }

        upgradePasswordIfNeeded(
                user,
                request.getPassword()
        );

        String token =
                jwtService.generateToken(user);

        return new LoginResponse(
                "Login Successful",
                user.getRole().getRoleName(),
                token,
                user.getEmail()
        );
    }

    private boolean passwordMatches(
            String password,
            String storedPassword
    ) {
        if (storedPassword == null) {
            return false;
        }

        if (isBcryptPassword(storedPassword)) {
            return passwordEncoder.matches(
                    password,
                    storedPassword
            );
        }

        return storedPassword.equals(password);
    }

    private void upgradePasswordIfNeeded(
            User user,
            String password
    ) {
        if (isBcryptPassword(
                user.getPasswordHash()
        )) {
            return;
        }

        user.setPasswordHash(
                passwordEncoder.encode(password)
        );

        userRepository.save(user);
    }

    private boolean isBcryptPassword(
            String password
    ) {
        if (password == null) {
            return false;
        }

        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
