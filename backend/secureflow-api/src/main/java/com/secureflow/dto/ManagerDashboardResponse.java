package com.secureflow.dto;

public class ManagerDashboardResponse {

    private final long awaitingApproval;
    private final long approved;
    private final long rejected;

    public ManagerDashboardResponse(
            long awaitingApproval,
            long approved,
            long rejected
    ) {
        this.awaitingApproval = awaitingApproval;
        this.approved = approved;
        this.rejected = rejected;
    }

    public long getAwaitingApproval() {
        return awaitingApproval;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }
}
