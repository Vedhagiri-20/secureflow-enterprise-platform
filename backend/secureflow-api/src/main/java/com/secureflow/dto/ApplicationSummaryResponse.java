package com.secureflow.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ApplicationSummaryResponse {

    private final Long workflowId;
    private final String workItemNumber;
    private final String loanType;
    private final BigDecimal loanAmount;
    private final String status;
    private final LocalDateTime submittedAt;

    public ApplicationSummaryResponse(
            Long workflowId,
            String workItemNumber,
            String loanType,
            BigDecimal loanAmount,
            String status,
            LocalDateTime submittedAt
    ) {
        this.workflowId = workflowId;
        this.workItemNumber = workItemNumber;
        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.status = status;
        this.submittedAt = submittedAt;
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

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
