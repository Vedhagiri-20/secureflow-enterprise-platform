package com.secureflow.dto;

public class LoginResponse {

    private String message;
    private String role;
    private String token;
    private String email;

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
                null
        );
    }

    public LoginResponse(
            String message,
            String role,
            String token,
            String email
    ) {
        this.message = message;
        this.role = role;
        this.token = token;
        this.email = email;
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
}
