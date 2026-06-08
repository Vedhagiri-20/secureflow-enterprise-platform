package com.secureflow.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
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
    @JoinColumn(name = "assigned_manager_id")
    private User assignedManager;

    @Column(name = "applicant_name")
    private String applicantName;

    @Column(name = "applicant_email")
    private String applicantEmail;

    @Column(name = "applicant_phone")
    private String applicantPhone;

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

    private String priority;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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

    public User getCreatedByUser() {
        return createdByUser;
    }

    public User getAssignedManager() {
        return assignedManager;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public String getApplicantPhone() {
        return applicantPhone;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public String getLoanPurpose() {
        return loanPurpose;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public String getGovernmentIdType() {
        return governmentIdType;
    }

    public String getGovernmentIdNumber() {
        return governmentIdNumber;
    }

    public String getResidentialAddress() {
        return residentialAddress;
    }

    public String getPriority() {
        return priority;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public void setCreatedByUser(User createdByUser) {
        this.createdByUser = createdByUser;
    }

    public void setAssignedManager(User assignedManager) {
        this.assignedManager = assignedManager;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }

    public void setApplicantPhone(String applicantPhone) {
        this.applicantPhone = applicantPhone;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public void setLoanPurpose(String loanPurpose) {
        this.loanPurpose = loanPurpose;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public void setGovernmentIdType(String governmentIdType) {
        this.governmentIdType = governmentIdType;
    }

    public void setGovernmentIdNumber(String governmentIdNumber) {
        this.governmentIdNumber = governmentIdNumber;
    }

    public void setResidentialAddress(String residentialAddress) {
        this.residentialAddress = residentialAddress;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}