package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReportWorkflowResponse {

    private String workItemNumber;
    private String loanType;
    private String applicantName;
    private BigDecimal loanAmount;
    private String status;
    private String managerName;
    private LocalDateTime createdDate;

    public ReportWorkflowResponse(
            String workItemNumber,
            String loanType,
            String applicantName,
            BigDecimal loanAmount,
            String status,
            String managerName,
            LocalDateTime createdDate
    ) {
        this.workItemNumber = workItemNumber;
        this.loanType = loanType;
        this.applicantName = applicantName;
        this.loanAmount = loanAmount;
        this.status = status;
        this.managerName = managerName;
        this.createdDate = createdDate;
    }

    public String getWorkItemNumber() { return workItemNumber; }
    public String getLoanType() { return loanType; }
    public String getApplicantName() { return applicantName; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public String getStatus() { return status; }
    public String getManagerName() { return managerName; }
    public LocalDateTime getCreatedDate() { return createdDate; }
}