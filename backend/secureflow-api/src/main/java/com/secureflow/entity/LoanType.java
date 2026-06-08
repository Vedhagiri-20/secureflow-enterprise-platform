package com.secureflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "loan_types")
public class LoanType {

    @Id
    @Column(name = "loan_type_id")
    private Long loanTypeId;

    @Column(name = "loan_name")
    private String loanName;

    @Column(name = "loan_code")
    private String loanCode;

    @Column(name = "default_priority")
    private String defaultPriority;

    @ManyToOne
    @JoinColumn(name = "manager_user_id")
    private User manager;

    public Long getLoanTypeId() { return loanTypeId; }
    public String getLoanName() { return loanName; }
    public String getLoanCode() { return loanCode; }
    public String getDefaultPriority() { return defaultPriority; }
    public User getManager() { return manager; }
}