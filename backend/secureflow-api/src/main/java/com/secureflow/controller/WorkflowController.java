package com.secureflow.controller;

import com.secureflow.dto.CreateWorkflowRequest;
import com.secureflow.dto.CreateWorkflowResponse;
import com.secureflow.dto.WorkflowDetailResponse;
import com.secureflow.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workflows")
@CrossOrigin(origins = "*")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @PostMapping("/create")
    public CreateWorkflowResponse createWorkflow(@RequestBody CreateWorkflowRequest request) {
        return workflowService.createWorkflow(request);
    }

    @GetMapping("/search")
    public WorkflowDetailResponse searchWorkflow(
            @RequestParam String email,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String loanType
    ) {
        return workflowService.searchWorkflow(email, query, loanType);
    }
}