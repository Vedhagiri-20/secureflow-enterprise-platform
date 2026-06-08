package com.secureflow.dto;

public class EmployeeDashboardResponse {

    private long total;
    private long pending;
    private long approved;
    private long rejected;

    public EmployeeDashboardResponse(long total, long pending, long approved, long rejected) {
        this.total = total;
        this.pending = pending;
        this.approved = approved;
        this.rejected = rejected;
    }

    public long getTotal() {
        return total;
    }

    public long getPending() {
        return pending;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }
}