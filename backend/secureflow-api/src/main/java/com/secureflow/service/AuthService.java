package com.secureflow.service;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

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

        String email = request.getEmail().trim();

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return new LoginResponse(
                    "Invalid Email",
                    null
            );
        }

        User user = userOptional.get();

        if (Boolean.FALSE.equals(user.getIsActive())) {
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

        return new LoginResponse(
                "Login Successful",
                user.getRole().getRoleName()
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
        if (isBcryptPassword(user.getPasswordHash())) {
            return;
        }

        user.setPasswordHash(
                passwordEncoder.encode(password)
        );

        userRepository.save(user);
    }

    private boolean isBcryptPassword(String password) {
        if (password == null) {
            return false;
        }

        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
