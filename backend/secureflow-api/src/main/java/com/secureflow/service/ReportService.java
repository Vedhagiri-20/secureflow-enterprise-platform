package com.secureflow.service;

import com.secureflow.dto.ReportResponse;
import com.secureflow.dto.ReportWorkflowResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    public ReportResponse getEmployeeReport(String email) {
        User employee = getEmployee(email);

        List<WorkflowRequest> workflows =
                workflowRequestRepository
                        .findByAssignedEmployeeOrderByUpdatedAtDesc(
                                employee
                        );

        long total = workflows.size();

        long pending = workflows.stream()
                .filter(workflow ->
                        WorkflowStatus.UNDER_REVIEW.name()
                                .equals(workflow.getCurrentStatus())
                                || WorkflowStatus
                                .FORWARDED_TO_MANAGER
                                .name()
                                .equals(workflow.getCurrentStatus())
                )
                .count();

        long approved = workflows.stream()
                .filter(workflow ->
                        WorkflowStatus.APPROVED.name()
                                .equals(workflow.getCurrentStatus())
                )
                .count();

        long rejected = workflows.stream()
                .filter(workflow ->
                        WorkflowStatus.REJECTED.name()
                                .equals(workflow.getCurrentStatus())
                )
                .count();

        Map<String, Long> loanBreakdown = workflows.stream()
                .collect(
                        Collectors.groupingBy(
                                workflow ->
                                        workflow
                                                .getLoanType()
                                                .getLoanName(),
                                LinkedHashMap::new,
                                Collectors.counting()
                        )
                );

        List<ReportWorkflowResponse> responses = workflows.stream()
                .map(workflow ->
                        new ReportWorkflowResponse(
                                workflow.getWorkItemNumber(),
                                workflow.getLoanType().getLoanName(),
                                workflow.getApplicantName(),
                                workflow.getLoanAmount(),
                                workflow.getCurrentStatus(),
                                workflow.getAssignedManager() == null
                                        ? "Not Assigned"
                                        : workflow
                                        .getAssignedManager()
                                        .getFullName(),
                                workflow.getSubmittedAt()
                        )
                )
                .toList();

        return new ReportResponse(
                total,
                pending,
                approved,
                rejected,
                loanBreakdown,
                responses
        );
    }

    private User getEmployee(String email) {
        User employee = userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Employee not found"
                        )
                );

        if (
                employee.getRole() == null
                        || !"EMPLOYEE".equalsIgnoreCase(
                                employee.getRole().getRoleName()
                        )
        ) {
            throw new RuntimeException(
                    "User is not an employee"
            );
        }

        return employee;
    }
}
