package com.secureflow;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.Role;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import com.secureflow.security.JwtService;
import com.secureflow.service.AuditService;
import com.secureflow.service.AuthService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private AuditService auditService;
    private AuthService authService;
    private User user;

    @BeforeEach
    void setUp() {
        userRepository =
                mock(UserRepository.class);

        jwtService =
                mock(JwtService.class);

        auditService =
                mock(AuditService.class);

        PasswordEncoder passwordEncoder =
                new BCryptPasswordEncoder();

        authService =
                new AuthService(
                        userRepository,
                        passwordEncoder,
                        jwtService,
                        auditService
                );

        user =
                new User();

        Role role =
                mock(Role.class);

        when(role.getRoleName())
                .thenReturn("CUSTOMER");

        user.setEmail(
                "customer@test.com"
        );

        user.setRole(role);
        user.setIsActive(true);

        when(jwtService
                .generateToken(user))
                .thenReturn("test-token");
    }

    @Test
    void successfulLoginReturnsJwtAndUpdatesLastLogin() {
        user.setPasswordHash(
                "password123"
        );

        when(userRepository
                .findByEmail(
                        "customer@test.com"
                ))
                .thenReturn(
                        Optional.of(user)
                );

        LoginResponse response =
                authService.login(
                        request(
                                "customer@test.com",
                                "password123"
                        )
                );

        assertEquals(
                "Login Successful",
                response.getMessage()
        );

        assertEquals(
                "test-token",
                response.getToken()
        );

        verify(userRepository)
                .save(user);

        verify(auditService)
                .record(
                        user,
                        "LOGIN",
                        "Successful secure login"
                );
    }

    @Test
    void bcryptPasswordStillAuthenticates() {
        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        user.setPasswordHash(
                encoder.encode(
                        "password123"
                )
        );

        when(userRepository
                .findByEmail(
                        "customer@test.com"
                ))
                .thenReturn(
                        Optional.of(user)
                );

        LoginResponse response =
                authService.login(
                        request(
                                "customer@test.com",
                                "password123"
                        )
                );

        assertEquals(
                "Login Successful",
                response.getMessage()
        );
    }

    @Test
    void invalidPasswordIsRejected() {
        user.setPasswordHash(
                "password123"
        );

        when(userRepository
                .findByEmail(
                        "customer@test.com"
                ))
                .thenReturn(
                        Optional.of(user)
                );

        LoginResponse response =
                authService.login(
                        request(
                                "customer@test.com",
                                "wrong-password"
                        )
                );

        assertEquals(
                "Invalid Password",
                response.getMessage()
        );
    }

    @Test
    void inactiveUserIsRejected() {
        user.setPasswordHash(
                "password123"
        );

        user.setIsActive(false);

        when(userRepository
                .findByEmail(
                        "customer@test.com"
                ))
                .thenReturn(
                        Optional.of(user)
                );

        LoginResponse response =
                authService.login(
                        request(
                                "customer@test.com",
                                "password123"
                        )
                );

        assertEquals(
                "User is inactive",
                response.getMessage()
        );
    }

    private LoginRequest request(
            String email,
            String password
    ) {
        LoginRequest request =
                new LoginRequest();

        request.setEmail(email);
        request.setPassword(password);

        return request;
    }
}
