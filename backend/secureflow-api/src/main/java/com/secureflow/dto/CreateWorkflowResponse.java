package com.secureflow.dto;

public class CreateWorkflowResponse {

    private String message;
    private String workItemNumber;

    public CreateWorkflowResponse(String message, String workItemNumber) {
        this.message = message;
        this.workItemNumber = workItemNumber;
    }

    public String getMessage() {
        return message;
    }

    public String getWorkItemNumber() {
        return workItemNumber;
    }
}