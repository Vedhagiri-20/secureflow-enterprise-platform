package com.secureflow.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Provides short browser-friendly routes while keeping the existing
 * static frontend files unchanged.
 */
@Controller
public class FrontendRouteController {

    @GetMapping("/login")
    public String login() {
        return "forward:/auth/login/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "forward:/auth/register/register.html";
    }

    @GetMapping("/client")
    public String customerDashboard() {
        return "forward:/dashboard/customer/customer-dashboard.html";
    }

    @GetMapping("/employee")
    public String employeeDashboard() {
        return "forward:/dashboard/employee/employee-dashboard.html";
    }

    @GetMapping("/manager")
    public String managerDashboard() {
        return "forward:/dashboard/manager/manager-dashboard.html";
    }

    @GetMapping("/admin")
    public String adminDashboard() {
        return "forward:/dashboard/admin/admin-dashboard.html";
    }

    @GetMapping("/eligibility")
    public String eligibility() {
        return "forward:/customer/eligibility/eligibility.html";
    }

    @GetMapping("/apply")
    public String apply() {
        return "forward:/workflow/create/create-workflow.html";
    }

    @GetMapping("/application")
    public String applicationDetails() {
        return "forward:/workflow/details/workflow-details.html";
    }

    @GetMapping("/reports")
    public String reports() {
        return "forward:/report/report.html";
    }

    @GetMapping("/notifications")
    public String notifications() {
        return "forward:/notification/notifications.html";
    }
}
