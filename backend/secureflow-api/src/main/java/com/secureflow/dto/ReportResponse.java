package com.secureflow.dto;

import java.util.List;
import java.util.Map;

public class ReportResponse {

    private long total;
    private long pending;
    private long approved;
    private long rejected;
    private Map<String, Long> loanBreakdown;
    private List<ReportWorkflowResponse> workflows;

    public ReportResponse(
            long total,
            long pending,
            long approved,
            long rejected,
            Map<String, Long> loanBreakdown,
            List<ReportWorkflowResponse> workflows
    ) {
        this.total = total;
        this.pending = pending;
        this.approved = approved;
        this.rejected = rejected;
        this.loanBreakdown = loanBreakdown;
        this.workflows = workflows;
    }

    public long getTotal() { return total; }
    public long getPending() { return pending; }
    public long getApproved() { return approved; }
    public long getRejected() { return rejected; }
    public Map<String, Long> getLoanBreakdown() { return loanBreakdown; }
    public List<ReportWorkflowResponse> getWorkflows() { return workflows; }
}