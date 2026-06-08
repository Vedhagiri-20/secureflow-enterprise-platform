package com.secureflow.controller;

import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/employee")
    public EmployeeDashboardResponse getEmployeeDashboard(
            @RequestParam String email
    ) {
        return dashboardService.getEmployeeDashboard(email);
    }
}