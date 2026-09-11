package com.secureflow;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.secureflow.dto.LoginRequest;
import com.secureflow.dto.LoginResponse;
import com.secureflow.entity.Role;
import com.secureflow.entity.User;
import com.secureflow.repository.UserRepository;
import com.secureflow.service.AuthService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = mock(User.class);
        role = mock(Role.class);

        when(user.getIsActive()).thenReturn(true);
        when(user.getRole()).thenReturn(role);
        when(role.getRoleName()).thenReturn("CUSTOMER");
    }

    @Test
    void loginAcceptsExistingPlainTextPasswordAndUpgradesIt() {
        when(user.getPasswordHash()).thenReturn("password123");

        when(userRepository.findByEmail("customer@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = authService.login(
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
                "CUSTOMER",
                response.getRole()
        );

        verify(user).setPasswordHash(anyString());
        verify(userRepository).save(user);
    }

    @Test
    void loginAcceptsBcryptPassword() {
        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String hash =
                encoder.encode("password123");

        when(user.getPasswordHash()).thenReturn(hash);

        when(userRepository.findByEmail("customer@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = authService.login(
                request(
                        "customer@test.com",
                        "password123"
                )
        );

        assertEquals(
                "Login Successful",
                response.getMessage()
        );

        verify(userRepository, never()).save(user);
    }

    @Test
    void loginRejectsInvalidPassword() {
        when(user.getPasswordHash())
                .thenReturn("password123");

        when(userRepository.findByEmail("customer@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = authService.login(
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
    void loginRejectsInactiveUser() {
        when(user.getIsActive()).thenReturn(false);

        when(userRepository.findByEmail("customer@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = authService.login(
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
