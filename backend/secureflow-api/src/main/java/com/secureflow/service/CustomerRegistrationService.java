package com.secureflow.service;

import com.secureflow.dto.CustomerRegistrationRequest;
import com.secureflow.dto.CustomerRegistrationResponse;
import com.secureflow.entity.Role;
import com.secureflow.entity.User;
import com.secureflow.repository.RoleRepository;
import com.secureflow.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerRegistrationService {

    private static final String CUSTOMER_ROLE = "CUSTOMER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public CustomerRegistrationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public CustomerRegistrationResponse register(
            CustomerRegistrationRequest request
    ) {
        validate(request);

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository
                .existsByEmailIgnoreCase(email)) {

            throw new RuntimeException(
                    "An account with this email already exists"
            );
        }

        Role customerRole =
                roleRepository
                        .findByRoleNameIgnoreCase(
                                CUSTOMER_ROLE
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Customer role is not configured"
                                )
                        );

        String fullName =
                buildFullName(request);

        User customer =
                new User();

        customer.setFullName(
                fullName
        );

        customer.setEmail(
                email
        );

        customer.setPhoneNumber(
                request.getPhoneNumber()
                        .trim()
        );

        customer.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        customer.setRole(
                customerRole
        );

        customer.setDepartment(
                "Private Client Banking"
        );

        customer.setIsActive(
                true
        );

        customer.setCreatedAt(
                LocalDateTime.now()
        );

        User saved =
                userRepository.save(
                        customer
                );

        auditService.record(
                saved,
                "CUSTOMER_REGISTERED",
                "New customer account created"
        );

        return new CustomerRegistrationResponse(
                "Customer account created successfully",
                saved.getEmail(),
                saved.getFullName()
        );
    }

    private void validate(
            CustomerRegistrationRequest request
    ) {
        if (request == null) {
            throw new RuntimeException(
                    "Registration details are required"
            );
        }

        requireText(
                request.getFirstName(),
                "First name is required"
        );

        requireText(
                request.getLastName(),
                "Last name is required"
        );

        requireText(
                request.getEmail(),
                "Email address is required"
        );

        requireText(
                request.getPhoneNumber(),
                "Mobile number is required"
        );

        requireText(
                request.getPassword(),
                "Password is required"
        );

        String email =
                request.getEmail()
                        .trim();

        if (!email.matches(
                "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        )) {
            throw new RuntimeException(
                    "Enter a valid email address"
            );
        }

        if (request.getPassword()
                .length() < 8) {

            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        String phone =
                request.getPhoneNumber()
                        .trim();

        if (!phone.matches(
                "^[0-9+()\\-\\s]{7,20}$"
        )) {
            throw new RuntimeException(
                    "Enter a valid mobile number"
            );
        }
    }

    private void requireText(
            String value,
            String message
    ) {
        if (value == null
                || value.isBlank()) {

            throw new RuntimeException(
                    message
            );
        }
    }

    private String buildFullName(
            CustomerRegistrationRequest request
    ) {
        List<String> names =
                new ArrayList<>();

        names.add(
                request.getFirstName()
                        .trim()
        );

        if (request.getMiddleName() != null
                && !request.getMiddleName()
                        .isBlank()) {

            names.add(
                    request.getMiddleName()
                            .trim()
            );
        }

        names.add(
                request.getLastName()
                        .trim()
        );

        return String.join(
                " ",
                names
        );
    }
}
