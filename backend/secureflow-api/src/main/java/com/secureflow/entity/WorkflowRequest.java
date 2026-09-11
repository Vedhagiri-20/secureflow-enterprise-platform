package com.secureflow.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflow_requests")
public class WorkflowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workflow_id")
    private Long workflowId;

    @Column(name = "work_item_number")
    private String workItemNumber;

    @ManyToOne
    @JoinColumn(name = "loan_type_id")
    private LoanType loanType;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdByUser;

    @ManyToOne
    @JoinColumn(name = "assigned_employee_id")
    private User assignedEmployee;

    @ManyToOne
    @JoinColumn(name = "assigned_manager_id")
    private User assignedManager;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "applicant_email")
    private String applicantEmail;

    @Column(name = "applicant_phone")
    private String applicantPhone;

    @Column(name = "applicant_first_name")
    private String applicantFirstName;

    @Column(name = "applicant_middle_name")
    private String applicantMiddleName;

    @Column(name = "applicant_last_name")
    private String applicantLastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "citizenship_status")
    private String citizenshipStatus;

    @Column(name = "requested_term_months")
    private Integer requestedTermMonths;

    @Column(name = "employer_name")
    private String employerName;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "annual_gross_income")
    private BigDecimal annualGrossIncome;

    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;

    @Column(name = "city")
    private String city;

    @Column(name = "state_province")
    private String stateProvince;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country_code")
    private String countryCode;

    @Column(name = "housing_status")
    private String housingStatus;

    @Column(name = "monthly_housing_payment")
    private BigDecimal monthlyHousingPayment;

    @Column(name = "loan_amount")
    private BigDecimal loanAmount;

    @Column(name = "loan_purpose")
    private String loanPurpose;

    @Column(name = "employment_type")
    private String employmentType;

    @Column(name = "government_id_type")
    private String governmentIdType;

    @Column(name = "government_id_number")
    private String governmentIdNumber;

    @Column(name = "residential_address")
    private String residentialAddress;

    @Column(name = "priority")
    private String priority;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void initializeTimestamps() {
        LocalDateTime now = LocalDateTime.now();

        if (submittedAt == null) {
            submittedAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    private void updateTimestamp() {
        updatedAt = LocalDateTime.now();
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public String getWorkItemNumber() {
        return workItemNumber;
    }

    public void setWorkItemNumber(String workItemNumber) {
        this.workItemNumber = workItemNumber;
    }

    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public User getCreatedByUser() {
        return createdByUser;
    }

    public void setCreatedByUser(User createdByUser) {
        this.createdByUser = createdByUser;
    }

    public User getAssignedEmployee() {
        return assignedEmployee;
    }

    public void setAssignedEmployee(User assignedEmployee) {
        this.assignedEmployee = assignedEmployee;
    }

    public User getAssignedManager() {
        return assignedManager;
    }

    public void setAssignedManager(User assignedManager) {
        this.assignedManager = assignedManager;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }

    public String getApplicantPhone() {
        return applicantPhone;
    }

    public void setApplicantPhone(String applicantPhone) {
        this.applicantPhone = applicantPhone;
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

    public Integer getRequestedTermMonths() {
        return requestedTermMonths;
    }

    public void setRequestedTermMonths(
            Integer requestedTermMonths
    ) {
        this.requestedTermMonths =
                requestedTermMonths;
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

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public String getLoanPurpose() {
        return loanPurpose;
    }

    public void setLoanPurpose(String loanPurpose) {
        this.loanPurpose = loanPurpose;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getGovernmentIdType() {
        return governmentIdType;
    }

    public void setGovernmentIdType(String governmentIdType) {
        this.governmentIdType = governmentIdType;
    }

    public String getGovernmentIdNumber() {
        return governmentIdNumber;
    }

    public void setGovernmentIdNumber(String governmentIdNumber) {
        this.governmentIdNumber = governmentIdNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public void setResidentialAddress(String residentialAddress) {
        this.residentialAddress = residentialAddress;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public void setCurrentStatus(WorkflowStatus currentStatus) {
        this.currentStatus = currentStatus == null ? null : currentStatus.name();
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
