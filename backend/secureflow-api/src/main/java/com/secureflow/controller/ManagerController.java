package com.secureflow.controller;

import com.secureflow.dto.ManagerApplicationResponse;
import com.secureflow.dto.ManagerDashboardResponse;
import com.secureflow.service.ManagerService;
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
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @GetMapping("/dashboard")
    public ManagerDashboardResponse getDashboard(
            @RequestParam String email
    ) {
        return managerService.getDashboard(email);
    }

    @GetMapping("/applications")
    public List<ManagerApplicationResponse> getApplications(
            @RequestParam String email
    ) {
        return managerService.getPendingApplications(email);
    }

    @PutMapping("/applications/{workflowId}/approve")
    public ManagerApplicationResponse approveApplication(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return managerService.approveApplication(
                workflowId,
                email
        );
    }

    @PutMapping("/applications/{workflowId}/reject")
    public ManagerApplicationResponse rejectApplication(
            @PathVariable Long workflowId,
            @RequestParam String email
    ) {
        return managerService.rejectApplication(
                workflowId,
                email
        );
    }
}
