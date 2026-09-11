package com.secureflow.dto;

/**
 * Public registration request for new customer accounts.
 */
public class CustomerRegistrationRequest {

    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;

    public CustomerRegistrationRequest() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(
            String firstName
    ) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(
            String middleName
    ) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(
            String lastName
    ) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(
            String phoneNumber
    ) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password
    ) {
        this.password = password;
    }
}
