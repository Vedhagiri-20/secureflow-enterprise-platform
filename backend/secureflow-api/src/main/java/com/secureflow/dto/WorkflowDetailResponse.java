package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WorkflowDetailResponse {

    private String workItemNumber;
    private String loanType;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private BigDecimal loanAmount;
    private String loanPurpose;
    private String status;
    private String priority;
    private String managerName;
    private LocalDateTime createdDate;

    public WorkflowDetailResponse(
            String workItemNumber,
            String loanType,
            String applicantName,
            String applicantEmail,
            String applicantPhone,
            BigDecimal loanAmount,
            String loanPurpose,
            String status,
            String priority,
            String managerName,
            LocalDateTime createdDate
    ) {
        this.workItemNumber = workItemNumber;
        this.loanType = loanType;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.applicantPhone = applicantPhone;
        this.loanAmount = loanAmount;
        this.loanPurpose = loanPurpose;
        this.status = status;
        this.priority = priority;
        this.managerName = managerName;
        this.createdDate = createdDate;
    }

    public String getWorkItemNumber() { return workItemNumber; }
    public String getLoanType() { return loanType; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public String getApplicantPhone() { return applicantPhone; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public String getLoanPurpose() { return loanPurpose; }
    public String getStatus() { return status; }
    public String getPriority() { return priority; }
    public String getManagerName() { return managerName; }
    public LocalDateTime getCreatedDate() { return createdDate; }
}