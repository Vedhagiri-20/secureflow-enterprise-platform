package com.secureflow.dto;

/**
 * Response returned after customer registration.
 */
public class CustomerRegistrationResponse {

    private final String message;
    private final String email;
    private final String fullName;

    public CustomerRegistrationResponse(
            String message,
            String email,
            String fullName
    ) {
        this.message = message;
        this.email = email;
        this.fullName = fullName;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}
