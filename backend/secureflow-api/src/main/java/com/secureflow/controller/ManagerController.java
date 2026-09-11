package com.secureflow.controller;

import com.secureflow.dto.ManagerApplicationResponse;
import com.secureflow.dto.ManagerDashboardResponse;
import com.secureflow.service.ManagerService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final ManagerService managerService;

    public ManagerController(
            ManagerService managerService
    ) {
        this.managerService =
                managerService;
    }

    @GetMapping("/dashboard")
    public ManagerDashboardResponse getDashboard(
            Authentication authentication
    ) {
        return managerService
                .getDashboard(
                        authentication.getName()
                );
    }

    @GetMapping("/applications")
    public List<ManagerApplicationResponse> getApplications(
            Authentication authentication
    ) {
        return managerService
                .getPendingApplications(
                        authentication.getName()
                );
    }

    @PutMapping("/applications/{workflowId}/approve")
    public ManagerApplicationResponse approveApplication(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return managerService
                .approveApplication(
                        workflowId,
                        authentication.getName()
                );
    }

    @PutMapping("/applications/{workflowId}/reject")
    public ManagerApplicationResponse rejectApplication(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return managerService
                .rejectApplication(
                        workflowId,
                        authentication.getName()
                );
    }
}
