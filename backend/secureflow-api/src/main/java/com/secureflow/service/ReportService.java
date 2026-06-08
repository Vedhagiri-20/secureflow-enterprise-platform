package com.secureflow.service;

import com.secureflow.dto.ReportResponse;
import com.secureflow.dto.ReportWorkflowResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    public ReportResponse getEmployeeReport(String email) {

        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<WorkflowRequest> workflows =
                workflowRequestRepository.findByCreatedByUserOrderBySubmittedAtDesc(employee);

        long total = workflows.size();

        long pending = workflows.stream()
                .filter(w -> "Pending".equalsIgnoreCase(w.getCurrentStatus()))
                .count();

        long approved = workflows.stream()
                .filter(w -> "Approved".equalsIgnoreCase(w.getCurrentStatus()))
                .count();

        long rejected = workflows.stream()
                .filter(w -> "Rejected".equalsIgnoreCase(w.getCurrentStatus()))
                .count();

        Map<String, Long> loanBreakdown = workflows.stream()
                .collect(Collectors.groupingBy(
                        w -> w.getLoanType().getLoanName(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        List<ReportWorkflowResponse> workflowResponses = workflows.stream()
                .map(w -> new ReportWorkflowResponse(
                        w.getWorkItemNumber(),
                        w.getLoanType().getLoanName(),
                        w.getApplicantName(),
                        w.getLoanAmount(),
                        w.getCurrentStatus(),
                        w.getAssignedManager() != null ? w.getAssignedManager().getFullName() : "Not Assigned",
                        w.getSubmittedAt()
                ))
                .toList();

        return new ReportResponse(
                total,
                pending,
                approved,
                rejected,
                loanBreakdown,
                workflowResponses
        );
    }
}