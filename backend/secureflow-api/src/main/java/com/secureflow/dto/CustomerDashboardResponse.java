package com.secureflow.dto;

public class CustomerDashboardResponse {

    private final long total;
    private final long submitted;
    private final long underReview;
    private final long forwarded;
    private final long approved;
    private final long rejected;

    public CustomerDashboardResponse(
            long total,
            long submitted,
            long underReview,
            long forwarded,
            long approved,
            long rejected
    ) {
        this.total = total;
        this.submitted = submitted;
        this.underReview = underReview;
        this.forwarded = forwarded;
        this.approved = approved;
        this.rejected = rejected;
    }

    public long getTotal() {
        return total;
    }

    public long getSubmitted() {
        return submitted;
    }

    public long getUnderReview() {
        return underReview;
    }

    public long getForwarded() {
        return forwarded;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }
}
