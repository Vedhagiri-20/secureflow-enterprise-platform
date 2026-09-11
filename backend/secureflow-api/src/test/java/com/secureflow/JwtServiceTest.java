package com.secureflow;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.secureflow.entity.Role;
import com.secureflow.entity.User;
import com.secureflow.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    @Test
    void tokenContainsEmailAndRole() {
        String secret =
                Base64.getEncoder()
                        .encodeToString(
                                "12345678901234567890123456789012"
                                        .getBytes(
                                                StandardCharsets.UTF_8
                                        )
                        );

        JwtService jwtService =
                new JwtService(
                        secret,
                        3600000
                );

        User user =
                mock(User.class);

        Role role =
                mock(Role.class);

        when(user.getEmail())
                .thenReturn(
                        "customer@test.com"
                );

        when(user.getRole())
                .thenReturn(role);

        when(role.getRoleName())
                .thenReturn("CUSTOMER");

        String token =
                jwtService.generateToken(user);

        assertTrue(
                jwtService.isValid(token)
        );

        assertEquals(
                "customer@test.com",
                jwtService.getEmail(token)
        );

        assertEquals(
                "CUSTOMER",
                jwtService.getRole(token)
        );
    }
}
