package com.secureflow.service;

import com.secureflow.dto.ManagerApplicationResponse;
import com.secureflow.dto.ManagerDashboardResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {

    private final UserRepository userRepository;
    private final WorkflowRequestRepository workflowRequestRepository;
    private final WorkflowHistoryService workflowHistoryService;

    public ManagerService(
            UserRepository userRepository,
            WorkflowRequestRepository workflowRequestRepository,
            WorkflowHistoryService workflowHistoryService
    ) {
        this.userRepository = userRepository;
        this.workflowRequestRepository =
                workflowRequestRepository;
        this.workflowHistoryService =
                workflowHistoryService;
    }

    public ManagerDashboardResponse getDashboard(
            String email
    ) {
        User manager =
                getManager(email);

        long awaitingApproval =
                workflowRequestRepository
                        .countByAssignedManagerAndCurrentStatus(
                                manager,
                                WorkflowStatus
                                        .FORWARDED_TO_MANAGER
                                        .name()
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

    public List<ManagerApplicationResponse>
            getPendingApplications(
                    String email
            ) {

        User manager =
                getManager(email);

        return workflowRequestRepository
                .findByAssignedManagerAndCurrentStatusOrderByUpdatedAtDesc(
                        manager,
                        WorkflowStatus
                                .FORWARDED_TO_MANAGER
                                .name()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ManagerApplicationResponse>
            getAllApplications(
                    String email
            ) {

        User manager =
                getManager(email);

        return workflowRequestRepository
                .findByAssignedManagerOrderByUpdatedAtDesc(
                        manager
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ManagerApplicationResponse approveApplication(
            Long workflowId,
            String email
    ) {
        User manager =
                getManager(email);

        WorkflowRequest workflow =
                getManagerWorkflow(
                        workflowId,
                        manager
                );

        validatePendingDecision(
                workflow
        );

        workflow.setCurrentStatus(
                WorkflowStatus.APPROVED
        );

        WorkflowRequest saved =
                workflowRequestRepository
                        .save(workflow);

        workflowHistoryService.record(
                saved,
                WorkflowStatus.APPROVED,
                manager.getEmail(),
                "MANAGER"
        );

        return toResponse(saved);
    }

    public ManagerApplicationResponse rejectApplication(
            Long workflowId,
            String email
    ) {
        User manager =
                getManager(email);

        WorkflowRequest workflow =
                getManagerWorkflow(
                        workflowId,
                        manager
                );

        validatePendingDecision(
                workflow
        );

        workflow.setCurrentStatus(
                WorkflowStatus.REJECTED
        );

        WorkflowRequest saved =
                workflowRequestRepository
                        .save(workflow);

        workflowHistoryService.record(
                saved,
                WorkflowStatus.REJECTED,
                manager.getEmail(),
                "MANAGER"
        );

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

    private void validatePendingDecision(
            WorkflowRequest workflow
    ) {
        if (!WorkflowStatus
                .FORWARDED_TO_MANAGER
                .name()
                .equals(
                        workflow.getCurrentStatus()
                )) {

            throw new RuntimeException(
                    "Application is not waiting for manager approval"
            );
        }
    }

    private User getManager(
            String email
    ) {
        if (email == null
                || email.isBlank()) {

            throw new RuntimeException(
                    "Manager email is required"
            );
        }

        User manager =
                userRepository
                        .findByEmail(
                                email.trim()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Manager not found"
                                )
                        );

        if (Boolean.FALSE.equals(
                manager.getIsActive()
        )) {
            throw new RuntimeException(
                    "Manager account is inactive"
            );
        }

        if (manager.getRole() == null
                || !"MANAGER".equalsIgnoreCase(
                        manager.getRole()
                                .getRoleName()
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
                        : workflow
                                .getAssignedEmployee()
                                .getFullName();

        return new ManagerApplicationResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getLoanType()
                        .getLoanName(),
                workflow.getLoanAmount(),
                workflow.getPriority(),
                workflow.getCurrentStatus(),
                employeeName,
                workflow.getSubmittedAt()
        );
    }
}
