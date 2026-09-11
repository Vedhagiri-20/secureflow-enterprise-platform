package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a customer loan application.
 */
public class CreateApplicationRequest {

    private Long loanTypeId;
    private String customerEmail;

    private String applicantName;
    private String applicantFirstName;
    private String applicantMiddleName;
    private String applicantLastName;
    private String applicantPhone;
    private LocalDate dateOfBirth;
    private String citizenshipStatus;

    private BigDecimal loanAmount;
    private String loanPurpose;
    private Integer requestedTermMonths;

    private String employmentType;
    private String employerName;
    private String jobTitle;
    private BigDecimal annualGrossIncome;

    private String governmentIdType;
    private String governmentIdNumber;

    private String residentialAddress;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String stateProvince;
    private String postalCode;
    private String countryCode;

    private String housingStatus;
    private BigDecimal monthlyHousingPayment;

    public Long getLoanTypeId() {
        return loanTypeId;
    }

    public void setLoanTypeId(
            Long loanTypeId
    ) {
        this.loanTypeId = loanTypeId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(
            String customerEmail
    ) {
        this.customerEmail = customerEmail;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(
            String applicantName
    ) {
        this.applicantName = applicantName;
    }

    public String getApplicantFirstName() {
        return applicantFirstName;
    }

    public void setApplicantFirstName(
            String applicantFirstName
    ) {
        this.applicantFirstName =
                applicantFirstName;
    }

    public String getApplicantMiddleName() {
        return applicantMiddleName;
    }

    public void setApplicantMiddleName(
            String applicantMiddleName
    ) {
        this.applicantMiddleName =
                applicantMiddleName;
    }

    public String getApplicantLastName() {
        return applicantLastName;
    }

    public void setApplicantLastName(
            String applicantLastName
    ) {
        this.applicantLastName =
                applicantLastName;
    }

    public String getApplicantPhone() {
        return applicantPhone;
    }

    public void setApplicantPhone(
            String applicantPhone
    ) {
        this.applicantPhone =
                applicantPhone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(
            LocalDate dateOfBirth
    ) {
        this.dateOfBirth =
                dateOfBirth;
    }

    public String getCitizenshipStatus() {
        return citizenshipStatus;
    }

    public void setCitizenshipStatus(
            String citizenshipStatus
    ) {
        this.citizenshipStatus =
                citizenshipStatus;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(
            BigDecimal loanAmount
    ) {
        this.loanAmount =
                loanAmount;
    }

    public String getLoanPurpose() {
        return loanPurpose;
    }

    public void setLoanPurpose(
            String loanPurpose
    ) {
        this.loanPurpose =
                loanPurpose;
    }

    public Integer getRequestedTermMonths() {
        return requestedTermMonths;
    }

    public void setRequestedTermMonths(
            Integer requestedTermMonths
    ) {
        this.requestedTermMonths =
                requestedTermMonths;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(
            String employmentType
    ) {
        this.employmentType =
                employmentType;
    }

    public String getEmployerName() {
        return employerName;
    }

    public void setEmployerName(
            String employerName
    ) {
        this.employerName =
                employerName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(
            String jobTitle
    ) {
        this.jobTitle =
                jobTitle;
    }

    public BigDecimal getAnnualGrossIncome() {
        return annualGrossIncome;
    }

    public void setAnnualGrossIncome(
            BigDecimal annualGrossIncome
    ) {
        this.annualGrossIncome =
                annualGrossIncome;
    }

    public String getGovernmentIdType() {
        return governmentIdType;
    }

    public void setGovernmentIdType(
            String governmentIdType
    ) {
        this.governmentIdType =
                governmentIdType;
    }

    public String getGovernmentIdNumber() {
        return governmentIdNumber;
    }

    public void setGovernmentIdNumber(
            String governmentIdNumber
    ) {
        this.governmentIdNumber =
                governmentIdNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public void setResidentialAddress(
            String residentialAddress
    ) {
        this.residentialAddress =
                residentialAddress;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(
            String addressLine1
    ) {
        this.addressLine1 =
                addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(
            String addressLine2
    ) {
        this.addressLine2 =
                addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city
    ) {
        this.city = city;
    }

    public String getStateProvince() {
        return stateProvince;
    }

    public void setStateProvince(
            String stateProvince
    ) {
        this.stateProvince =
                stateProvince;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(
            String postalCode
    ) {
        this.postalCode =
                postalCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(
            String countryCode
    ) {
        this.countryCode =
                countryCode;
    }

    public String getHousingStatus() {
        return housingStatus;
    }

    public void setHousingStatus(
            String housingStatus
    ) {
        this.housingStatus =
                housingStatus;
    }

    public BigDecimal getMonthlyHousingPayment() {
        return monthlyHousingPayment;
    }

    public void setMonthlyHousingPayment(
            BigDecimal monthlyHousingPayment
    ) {
        this.monthlyHousingPayment =
                monthlyHousingPayment;
    }
}
