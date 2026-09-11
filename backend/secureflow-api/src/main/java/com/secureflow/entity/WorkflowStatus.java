package com.secureflow.entity;

/**
 * Represents the supported lifecycle states of a SecureFlow loan application.
 */
public enum WorkflowStatus {

    SUBMITTED,
    UNDER_REVIEW,
    FORWARDED_TO_MANAGER,
    APPROVED,
    REJECTED
}
