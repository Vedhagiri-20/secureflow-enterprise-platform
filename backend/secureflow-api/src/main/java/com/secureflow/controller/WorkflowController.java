package com.secureflow.controller;

import com.secureflow.dto.WorkflowDetailResponse;
import com.secureflow.service.WorkflowService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(
            WorkflowService workflowService
    ) {
        this.workflowService =
                workflowService;
    }

    @GetMapping("/search")
    public WorkflowDetailResponse searchWorkflow(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String loanType,
            Authentication authentication
    ) {
        return workflowService.searchWorkflow(
                authentication.getName(),
                query,
                loanType
        );
    }
}
