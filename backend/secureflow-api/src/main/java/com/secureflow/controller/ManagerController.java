package com.secureflow.controller;

import com.secureflow.dto.ApplicationDetailResponse;
import com.secureflow.dto.ManagerApplicationResponse;
import com.secureflow.dto.ManagerDashboardResponse;
import com.secureflow.dto.WorkflowHistoryResponse;
import com.secureflow.service.ApplicationViewService;
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
    private final ApplicationViewService applicationViewService;

    public ManagerController(
            ManagerService managerService,
            ApplicationViewService applicationViewService
    ) {
        this.managerService =
                managerService;

        this.applicationViewService =
                applicationViewService;
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
    public List<ManagerApplicationResponse>
            getApplications(
                    Authentication authentication
            ) {

        return managerService
                .getPendingApplications(
                        authentication.getName()
                );
    }

    @GetMapping("/applications/all")
    public List<ManagerApplicationResponse>
            getAllApplications(
                    Authentication authentication
            ) {

        return managerService
                .getAllApplications(
                        authentication.getName()
                );
    }

    @GetMapping("/applications/{workflowId}")
    public ApplicationDetailResponse getApplication(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return applicationViewService
                .getManagerApplication(
                        workflowId,
                        authentication.getName()
                );
    }

    @GetMapping(
            "/applications/{workflowId}/history"
    )
    public List<WorkflowHistoryResponse> getHistory(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return applicationViewService
                .getManagerHistory(
                        workflowId,
                        authentication.getName()
                );
    }

    @PutMapping(
            "/applications/{workflowId}/approve"
    )
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

    @PutMapping(
            "/applications/{workflowId}/reject"
    )
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
