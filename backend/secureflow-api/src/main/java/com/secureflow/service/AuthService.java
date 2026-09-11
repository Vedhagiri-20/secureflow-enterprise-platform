package com.secureflow.service;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import com.secureflow.security.JwtService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }

    public LoginResponse login(
            LoginRequest request
    ) {
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

        user.setLastLoginAt(
                LocalDateTime.now()
        );

        userRepository.save(user);

        String token =
                jwtService.generateToken(user);

        auditService.record(
                user,
                "LOGIN",
                "Successful secure login"
        );

        return new LoginResponse(
                "Login Successful",
                user.getRole().getRoleName(),
                token,
                user.getEmail(),
                user.getFullName()
        );
    }

    private boolean passwordMatches(
            String password,
            String storedPassword
    ) {
        if (storedPassword == null) {
            return false;
        }

        if (isBcryptPassword(
                storedPassword
        )) {
            return passwordEncoder.matches(
                    password,
                    storedPassword
            );
        }

        return storedPassword.equals(
                password
        );
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
                passwordEncoder.encode(
                        password
                )
        );
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
