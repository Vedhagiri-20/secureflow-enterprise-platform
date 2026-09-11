package com.secureflow.controller;

import com.secureflow.dto.ApplicationDetailResponse;
import com.secureflow.dto.ApplicationSummaryResponse;
import com.secureflow.dto.CreateApplicationRequest;
import com.secureflow.dto.CustomerDashboardResponse;
import com.secureflow.dto.WorkflowHistoryResponse;
import com.secureflow.service.WorkflowService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final WorkflowService workflowService;

    public CustomerController(
            WorkflowService workflowService
    ) {
        this.workflowService =
                workflowService;
    }

    @PostMapping("/applications")
    public ApplicationDetailResponse createApplication(
            @RequestBody CreateApplicationRequest request,
            Authentication authentication
    ) {
        request.setCustomerEmail(
                authentication.getName()
        );

        return workflowService
                .createApplication(request);
    }

    @GetMapping("/applications")
    public List<ApplicationSummaryResponse> getApplications(
            Authentication authentication
    ) {
        return workflowService
                .getCustomerApplications(
                        authentication.getName()
                );
    }

    @GetMapping("/applications/{workflowId}")
    public ApplicationDetailResponse getApplication(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return workflowService
                .getCustomerApplication(
                        workflowId,
                        authentication.getName()
                );
    }

    @GetMapping("/applications/{workflowId}/history")
    public List<WorkflowHistoryResponse> getHistory(
            @PathVariable Long workflowId,
            Authentication authentication
    ) {
        return workflowService
                .getCustomerApplicationHistory(
                        workflowId,
                        authentication.getName()
                );
    }

    @GetMapping("/dashboard")
    public CustomerDashboardResponse getDashboard(
            Authentication authentication
    ) {
        return workflowService
                .getCustomerDashboard(
                        authentication.getName()
                );
    }
}
