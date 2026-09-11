package com.secureflow.dto;

public class LoginResponse {

    private String message;
    private String role;
    private String token;
    private String email;
    private String fullName;

    public LoginResponse() {
    }

    public LoginResponse(
            String message,
            String role
    ) {
        this(
                message,
                role,
                null,
                null,
                null
        );
    }

    public LoginResponse(
            String message,
            String role,
            String token,
            String email
    ) {
        this(
                message,
                role,
                token,
                email,
                null
        );
    }

    public LoginResponse(
            String message,
            String role,
            String token,
            String email,
            String fullName
    ) {
        this.message = message;
        this.role = role;
        this.token = token;
        this.email = email;
        this.fullName = fullName;
    }

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
}
