package com.secureflow.dto;

import java.time.LocalDateTime;

public class AdminAuditResponse {

    private final String eventId;
    private final String actorEmail;
    private final String actorRole;
    private final String action;
    private final String details;
    private final Long workflowId;
    private final LocalDateTime createdAt;

    public AdminAuditResponse(
            String eventId,
            String actorEmail,
            String actorRole,
            String action,
            String details,
            Long workflowId,
            LocalDateTime createdAt
    ) {
        this.eventId = eventId;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.action = action;
        this.details = details;
        this.workflowId = workflowId;
        this.createdAt = createdAt;
    }

    public String getEventId() {
        return eventId;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public String getActorRole() {
        return actorRole;
    }

    public String getAction() {
        return action;
    }

    public String getDetails() {
        return details;
    }

    public Long getWorkflowId() {
        return workflowId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
