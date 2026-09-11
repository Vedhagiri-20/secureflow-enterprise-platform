package com.secureflow.controller;

import com.secureflow.dto.ApplicationDetailResponse;
import com.secureflow.dto.ApplicationSummaryResponse;
import com.secureflow.dto.CreateApplicationRequest;
import com.secureflow.dto.CustomerDashboardResponse;
import com.secureflow.service.WorkflowService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private WorkflowService workflowService;

    @PostMapping("/applications")
    public ApplicationDetailResponse createApplication(
            @RequestBody CreateApplicationRequest request
    ) {
        return workflowService.createApplication(request);
    }

    @GetMapping("/applications")
    public List<ApplicationSummaryResponse> getApplications(
            @RequestParam String email
    ) {
        return workflowService.getCustomerApplications(email);
    }

    @GetMapping("/applications/{workflowId}")
    public ApplicationDetailResponse getApplication(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return workflowService.getCustomerApplication(workflowId, email);
    }

    @GetMapping("/dashboard")
    public CustomerDashboardResponse getDashboard(
            @RequestParam String email
    ) {
        return workflowService.getCustomerDashboard(email);
    }
}
