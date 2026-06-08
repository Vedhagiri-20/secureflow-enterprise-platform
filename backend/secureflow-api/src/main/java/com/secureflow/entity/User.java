package com.secureflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String department;

    @Column(name = "is_active")
    private Boolean isActive;

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getDepartment() {
        return department;
    }

    public Boolean getIsActive() {
        return isActive;
    }
}