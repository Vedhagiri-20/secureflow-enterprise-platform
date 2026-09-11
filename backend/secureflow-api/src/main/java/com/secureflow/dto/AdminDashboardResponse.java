package com.secureflow.dto;

import java.util.List;

public class AdminDashboardResponse {

    private final long totalUsers;
    private final long activeUsers;
    private final long customers;
    private final long employees;
    private final long managers;
    private final long totalApplications;
    private final long totalAuditEvents;
    private final List<AdminAuditResponse> recentActivities;

    public AdminDashboardResponse(
            long totalUsers,
            long activeUsers,
            long customers,
            long employees,
            long managers,
            long totalApplications,
            long totalAuditEvents,
            List<AdminAuditResponse> recentActivities
    ) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.customers = customers;
        this.employees = employees;
        this.managers = managers;
        this.totalApplications = totalApplications;
        this.totalAuditEvents = totalAuditEvents;
        this.recentActivities = recentActivities;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public long getCustomers() {
        return customers;
    }

    public long getEmployees() {
        return employees;
    }

    public long getManagers() {
        return managers;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getTotalAuditEvents() {
        return totalAuditEvents;
    }

    public List<AdminAuditResponse> getRecentActivities() {
        return recentActivities;
    }
}
