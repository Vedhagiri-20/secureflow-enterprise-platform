package com.secureflow.dto;

import java.math.BigDecimal;

public class CreateWorkflowRequest {

    private Long loanTypeId;
    private String employeeEmail;
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private BigDecimal loanAmount;
    private String loanPurpose;
    private String employmentType;
    private String governmentIdType;
    private String governmentIdNumber;
    private String residentialAddress;
    private String priority;

    public Long getLoanTypeId() { return loanTypeId; }
    public String getEmployeeEmail() { return employeeEmail; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public String getApplicantPhone() { return applicantPhone; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public String getLoanPurpose() { return loanPurpose; }
    public String getEmploymentType() { return employmentType; }
    public String getGovernmentIdType() { return governmentIdType; }
    public String getGovernmentIdNumber() { return governmentIdNumber; }
    public String getResidentialAddress() { return residentialAddress; }
    public String getPriority() { return priority; }
}