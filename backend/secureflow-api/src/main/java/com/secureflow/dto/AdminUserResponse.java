package com.secureflow.dto;

import java.time.LocalDateTime;

public class AdminUserResponse {

    private final Long userId;
    private final String fullName;
    private final String email;
    private final String role;
    private final String phoneNumber;
    private final String department;
    private final Boolean active;
    private final LocalDateTime lastLoginAt;
    private final LocalDateTime createdAt;
    private final String passwordStatus;

    public AdminUserResponse(
            Long userId,
            String fullName,
            String email,
            String role,
            String phoneNumber,
            String department,
            Boolean active,
            LocalDateTime lastLoginAt,
            LocalDateTime createdAt,
            String passwordStatus
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.department = department;
        this.active = active;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
        this.passwordStatus = passwordStatus;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getDepartment() {
        return department;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getPasswordStatus() {
        return passwordStatus;
    }
}
