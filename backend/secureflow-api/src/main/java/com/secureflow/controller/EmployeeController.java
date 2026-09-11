package com.secureflow.controller;

import com.secureflow.dto.EmployeeApplicationResponse;
import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.service.DashboardService;
import com.secureflow.service.WorkflowService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private WorkflowService workflowService;

    @GetMapping("/dashboard")
    public EmployeeDashboardResponse getDashboard(
            @RequestParam String email
    ) {
        return dashboardService.getEmployeeDashboard(email);
    }

    @GetMapping("/applications/available")
    public List<EmployeeApplicationResponse> getAvailableApplications(
            @RequestParam String email
    ) {
        return workflowService.getAvailableApplications(email);
    }

    @GetMapping("/applications")
    public List<EmployeeApplicationResponse> getEmployeeApplications(
            @RequestParam String email
    ) {
        return workflowService.getEmployeeApplications(email);
    }

    @PutMapping("/applications/{workflowId}/review")
    public EmployeeApplicationResponse startReview(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return workflowService.startReview(workflowId, email);
    }

    @PutMapping("/applications/{workflowId}/forward")
    public EmployeeApplicationResponse forwardToManager(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return workflowService.forwardToManager(workflowId, email);
    }

    @PutMapping("/applications/{workflowId}/reject")
    public EmployeeApplicationResponse rejectApplication(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return workflowService.rejectApplication(workflowId, email);
    }
}
