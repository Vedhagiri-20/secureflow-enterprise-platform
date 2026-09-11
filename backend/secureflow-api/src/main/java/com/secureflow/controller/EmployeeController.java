package com.secureflow.controller;

import com.secureflow.dto.EmployeeApplicationResponse;
import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.service.DashboardService;
import com.secureflow.service.WorkflowService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final DashboardService dashboardService;
    private final WorkflowService workflowService;

    public EmployeeController(
            DashboardService dashboardService,
            WorkflowService workflowService
    ) {
        this.dashboardService =
                dashboardService;

        this.workflowService =
                workflowService;
    }

    @GetMapping("/dashboard")
    public EmployeeDashboardResponse getDashboard(
            Authentication authentication
    ) {
        return dashboardService
                .getEmployeeDashboard(
                        authentication.getName()
                );
    }

    @GetMapping("/applications/available")
    public List<EmployeeApplicationResponse>
            getAvailableApplications(
                    Authentication authentication
            ) {

        return workflowService
                .getAvailableApplications(
                        authentication.getName()
                );
    }

    @GetMapping("/applications")
    public List<EmployeeApplicationResponse>
            getEmployeeApplications(
                    Authentication authentication
            ) {

        return workflowService
                .getEmployeeApplications(
                        authentication.getName()
                );
    }

    @PutMapping("/applications/{workflowId}/review")
    public EmployeeApplicationResponse startReview(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return workflowService.startReview(
                workflowId,
                authentication.getName()
        );
    }

    @PutMapping("/applications/{workflowId}/forward")
    public EmployeeApplicationResponse forwardToManager(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return workflowService.forwardToManager(
                workflowId,
                authentication.getName()
        );
    }

    @PutMapping("/applications/{workflowId}/reject")
    public EmployeeApplicationResponse rejectApplication(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return workflowService.rejectApplication(
                workflowId,
                authentication.getName()
        );
    }
}
