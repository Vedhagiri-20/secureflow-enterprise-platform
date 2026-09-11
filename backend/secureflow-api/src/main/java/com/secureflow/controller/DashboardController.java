package com.secureflow.controller;

import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService =
                dashboardService;
    }

    @GetMapping("/employee")
    public EmployeeDashboardResponse getEmployeeDashboard(
            Authentication authentication
    ) {
        return dashboardService
                .getEmployeeDashboard(
                        authentication.getName()
                );
    }
}
