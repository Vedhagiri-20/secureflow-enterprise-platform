package com.secureflow.service;

import com.secureflow.dto.ReportResponse;
import com.secureflow.dto.ReportWorkflowResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Builds workflow reports for the authenticated employee.
 */
@Service
public class ReportService {

    private static final Set<String> PENDING_STATUSES =
            Set.of(
                    "PENDING",
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "FORWARDED_TO_MANAGER"
            );

    private final UserRepository userRepository;
    private final WorkflowRequestRepository workflowRequestRepository;

    public ReportService(
            UserRepository userRepository,
            WorkflowRequestRepository workflowRequestRepository
    ) {
        this.userRepository =
                userRepository;

        this.workflowRequestRepository =
                workflowRequestRepository;
    }

    public ReportResponse getEmployeeReport(
            String email
    ) {
        User employee =
                userRepository.findByEmail(
                        email
                ).orElseThrow(
                        () -> new RuntimeException(
                                "Employee not found"
                        )
                );

        List<WorkflowRequest> workflows =
                workflowRequestRepository
                        .findByAssignedEmployeeOrderByUpdatedAtDesc(
                                employee
                        );

        long total =
                workflows.size();

        long pending =
                workflows.stream()
                        .filter(workflow ->
                                isPending(
                                        workflow.getCurrentStatus()
                                )
                        )
                        .count();

        long approved =
                workflows.stream()
                        .filter(workflow ->
                                "APPROVED".equalsIgnoreCase(
                                        workflow.getCurrentStatus()
                                )
                        )
                        .count();

        long rejected =
                workflows.stream()
                        .filter(workflow ->
                                "REJECTED".equalsIgnoreCase(
                                        workflow.getCurrentStatus()
                                )
                        )
                        .count();

        Map<String, Long> loanBreakdown =
                workflows.stream()
                        .collect(
                                Collectors.groupingBy(
                                        workflow ->
                                                workflow.getLoanType()
                                                        .getLoanName(),
                                        LinkedHashMap::new,
                                        Collectors.counting()
                                )
                        );

        List<ReportWorkflowResponse> responses =
                workflows.stream()
                        .map(this::toResponse)
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

    private boolean isPending(
            String status
    ) {
        if (status == null) {
            return false;
        }

        return PENDING_STATUSES.contains(
                status.toUpperCase()
        );
    }

    private ReportWorkflowResponse toResponse(
            WorkflowRequest workflow
    ) {
        String managerName =
                workflow.getAssignedManager() == null
                        ? "Not Assigned"
                        : workflow.getAssignedManager()
                                .getFullName();

        return new ReportWorkflowResponse(
                workflow.getWorkItemNumber(),
                workflow.getLoanType()
                        .getLoanName(),
                workflow.getApplicantName(),
                workflow.getLoanAmount(),
                workflow.getCurrentStatus(),
                managerName,
                workflow.getSubmittedAt()
        );
    }
}
