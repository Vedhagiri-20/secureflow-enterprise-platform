package com.secureflow.service;

import com.secureflow.dto.ManagerApplicationResponse;
import com.secureflow.dto.ManagerDashboardResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    public ManagerDashboardResponse getDashboard(String email) {
        User manager = getManager(email);

        long awaitingApproval =
                workflowRequestRepository
                        .countByAssignedManagerAndCurrentStatus(
                                manager,
                                WorkflowStatus.FORWARDED_TO_MANAGER.name()
                        );

        long approved =
                workflowRequestRepository
                        .countByAssignedManagerAndCurrentStatus(
                                manager,
                                WorkflowStatus.APPROVED.name()
                        );

        long rejected =
                workflowRequestRepository
                        .countByAssignedManagerAndCurrentStatus(
                                manager,
                                WorkflowStatus.REJECTED.name()
                        );

        return new ManagerDashboardResponse(
                awaitingApproval,
                approved,
                rejected
        );
    }

    public List<ManagerApplicationResponse> getPendingApplications(
            String email
    ) {
        User manager = getManager(email);

        return workflowRequestRepository
                .findByAssignedManagerAndCurrentStatusOrderByUpdatedAtDesc(
                        manager,
                        WorkflowStatus.FORWARDED_TO_MANAGER.name()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ManagerApplicationResponse approveApplication(
            Long workflowId,
            String email
    ) {
        User manager = getManager(email);

        WorkflowRequest workflow = getManagerWorkflow(
                workflowId,
                manager
        );

        validatePendingDecision(workflow);

        workflow.setCurrentStatus(WorkflowStatus.APPROVED);

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        return toResponse(saved);
    }

    public ManagerApplicationResponse rejectApplication(
            Long workflowId,
            String email
    ) {
        User manager = getManager(email);

        WorkflowRequest workflow = getManagerWorkflow(
                workflowId,
                manager
        );

        validatePendingDecision(workflow);

        workflow.setCurrentStatus(WorkflowStatus.REJECTED);

        WorkflowRequest saved =
                workflowRequestRepository.save(workflow);

        return toResponse(saved);
    }

    private WorkflowRequest getManagerWorkflow(
            Long workflowId,
            User manager
    ) {
        return workflowRequestRepository
                .findByWorkflowIdAndAssignedManager(
                        workflowId,
                        manager
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Application not assigned to this manager"
                        )
                );
    }

    private void validatePendingDecision(WorkflowRequest workflow) {
        if (!WorkflowStatus.FORWARDED_TO_MANAGER.name()
                .equals(workflow.getCurrentStatus())) {
            throw new RuntimeException(
                    "Application is not waiting for manager approval"
            );
        }
    }

    private User getManager(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Manager email is required");
        }

        User manager = userRepository.findByEmail(email.trim())
                .orElseThrow(
                        () -> new RuntimeException("Manager not found")
                );

        if (Boolean.FALSE.equals(manager.getIsActive())) {
            throw new RuntimeException(
                    "Manager account is inactive"
            );
        }

        if (manager.getRole() == null
                || !"MANAGER".equalsIgnoreCase(
                        manager.getRole().getRoleName()
                )) {
            throw new RuntimeException(
                    "User is not a manager"
            );
        }

        return manager;
    }

    private ManagerApplicationResponse toResponse(
            WorkflowRequest workflow
    ) {
        String employeeName =
                workflow.getAssignedEmployee() == null
                        ? "Not Assigned"
                        : workflow.getAssignedEmployee().getFullName();

        return new ManagerApplicationResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getLoanType().getLoanName(),
                workflow.getLoanAmount(),
                workflow.getPriority(),
                workflow.getCurrentStatus(),
                employeeName,
                workflow.getSubmittedAt()
        );
    }
}
