package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ApplicationDetailResponse {

    private final Long workflowId;
    private final String workItemNumber;
    private final String loanType;
    private final String applicantName;
    private final String applicantEmail;
    private final String applicantPhone;
    private final BigDecimal loanAmount;
    private final String loanPurpose;
    private final String employmentType;
    private final String governmentIdType;
    private final String governmentIdNumber;
    private final String residentialAddress;
    private final String priority;
    private final String status;
    private final String employeeName;
    private final String managerName;
    private final LocalDateTime submittedAt;
    private final LocalDateTime updatedAt;

    public ApplicationDetailResponse(
            Long workflowId,
            String workItemNumber,
            String loanType,
            String applicantName,
            String applicantEmail,
            String applicantPhone,
            BigDecimal loanAmount,
            String loanPurpose,
            String employmentType,
            String governmentIdType,
            String governmentIdNumber,
            String residentialAddress,
            String priority,
            String status,
            String employeeName,
            String managerName,
            LocalDateTime submittedAt,
            LocalDateTime updatedAt
    ) {
        this.workflowId = workflowId;
        this.workItemNumber = workItemNumber;
        this.loanType = loanType;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.loanAmount = loanAmount;
        this.loanPurpose = loanPurpose;
        this.employmentType = employmentType;
        this.governmentIdType = governmentIdType;
        this.governmentIdNumber = governmentIdNumber;
        this.residentialAddress = residentialAddress;
        this.priority = priority;
        this.status = status;
        this.employeeName = employeeName;
        this.managerName = managerName;
        this.submittedAt = submittedAt;
        this.updatedAt = updatedAt;
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public String getWorkItemNumber() {
        return workItemNumber;
    }

    public String getLoanType() {
        return loanType;
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

    public String getStatus() {
        return status;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getManagerName() {
        return managerName;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
