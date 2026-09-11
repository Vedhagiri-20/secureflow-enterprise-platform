package com.secureflow.dto;

import java.time.LocalDateTime;

public class WorkflowHistoryResponse {

    private final Long eventId;
    private final String status;
    private final String actorEmail;
    private final String actorRole;
    private final LocalDateTime changedAt;

    public WorkflowHistoryResponse(
            Long eventId,
            String status,
            String actorEmail,
            String actorRole,
            LocalDateTime changedAt
    ) {
        this.eventId = eventId;
        this.status = status;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.changedAt = changedAt;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getStatus() {
        return status;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public String getActorRole() {
        return actorRole;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }
}
