package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ManagerApplicationResponse {

    private final Long workflowId;
    private final String workItemNumber;
    private final String applicantName;
    private final String applicantEmail;
    private final String loanType;
    private final BigDecimal loanAmount;
    private final String priority;
    private final String status;
    private final String employeeName;
    private final LocalDateTime submittedAt;

    public ManagerApplicationResponse(
            Long workflowId,
            String workItemNumber,
            String applicantName,
            String applicantEmail,
            String loanType,
            BigDecimal loanAmount,
            String priority,
            String status,
            String employeeName,
            LocalDateTime submittedAt
    ) {
        this.workflowId = workflowId;
        this.workItemNumber = workItemNumber;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.priority = priority;
        this.status = status;
        this.employeeName = employeeName;
        this.submittedAt = submittedAt;
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public String getWorkItemNumber() {
        return workItemNumber;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public String getLoanType() {
        return loanType;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
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

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
