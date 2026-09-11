package com.secureflow.dto;

public class EmployeeDashboardResponse {

    private final long available;
    private final long assigned;
    private final long underReview;
    private final long forwarded;
    private final long rejected;

    public EmployeeDashboardResponse(
            long available,
            long assigned,
            long underReview,
            long forwarded,
            long rejected
    ) {
        this.available = available;
        this.assigned = assigned;
        this.underReview = underReview;
        this.forwarded = forwarded;
        this.rejected = rejected;
    }

    public long getAvailable() {
        return available;
    }

    public long getAssigned() {
        return assigned;
    }

    public long getUnderReview() {
        return underReview;
    }

    public long getForwarded() {
        return forwarded;
    }

    public long getRejected() {
        return rejected;
    }
}
