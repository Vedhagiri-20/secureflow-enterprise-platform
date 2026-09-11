package com.secureflow.service;

import com.secureflow.dto.ApplicationDetailResponse;
import com.secureflow.dto.WorkflowHistoryResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ApplicationViewService {

    private final UserRepository userRepository;
    private final WorkflowRequestRepository workflowRequestRepository;
    private final WorkflowHistoryService workflowHistoryService;

    public ApplicationViewService(
            UserRepository userRepository,
            WorkflowRequestRepository workflowRequestRepository,
            WorkflowHistoryService workflowHistoryService
    ) {
        this.userRepository = userRepository;
        this.workflowRequestRepository = workflowRequestRepository;
        this.workflowHistoryService = workflowHistoryService;
    }

    public ApplicationDetailResponse getEmployeeApplication(
            Long workflowId,
            String email
    ) {
        User employee = getUserByRole(
                email,
                "EMPLOYEE"
        );

        WorkflowRequest workflow =
                getEmployeeVisibleWorkflow(
                        workflowId,
                        employee
                );

        return toApplicationDetail(workflow);
    }

    public List<WorkflowHistoryResponse> getEmployeeHistory(
            Long workflowId,
            String email
    ) {
        User employee = getUserByRole(
                email,
                "EMPLOYEE"
        );

        getEmployeeVisibleWorkflow(
                workflowId,
                employee
        );

        return workflowHistoryService
                .getHistory(workflowId);
    }

    public ApplicationDetailResponse getManagerApplication(
            Long workflowId,
            String email
    ) {
        User manager = getUserByRole(
                email,
                "MANAGER"
        );

        WorkflowRequest workflow =
                getManagerVisibleWorkflow(
                        workflowId,
                        manager
                );

        return toApplicationDetail(workflow);
    }

    public List<WorkflowHistoryResponse> getManagerHistory(
            Long workflowId,
            String email
    ) {
        User manager = getUserByRole(
                email,
                "MANAGER"
        );

        getManagerVisibleWorkflow(
                workflowId,
                manager
        );

        return workflowHistoryService
                .getHistory(workflowId);
    }

    private WorkflowRequest getEmployeeVisibleWorkflow(
            Long workflowId,
            User employee
    ) {
        WorkflowRequest workflow =
                workflowRequestRepository
                        .findById(workflowId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Application not found"
                                )
                        );

        boolean assignedToEmployee =
                workflow.getAssignedEmployee() != null
                        && workflow
                        .getAssignedEmployee()
                        .getUserId()
                        .equals(employee.getUserId());

        boolean availableForReview =
                WorkflowStatus.SUBMITTED
                        .name()
                        .equals(
                                workflow.getCurrentStatus()
                        )
                        && workflow.getAssignedEmployee() == null;

        if (!assignedToEmployee
                && !availableForReview) {
            throw new RuntimeException(
                    "You cannot view this application"
            );
        }

        return workflow;
    }

    private WorkflowRequest getManagerVisibleWorkflow(
            Long workflowId,
            User manager
    ) {
        WorkflowRequest workflow =
                workflowRequestRepository
                        .findById(workflowId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Application not found"
                                )
                        );

        boolean assignedToManager =
                workflow.getAssignedManager() != null
                        && workflow
                        .getAssignedManager()
                        .getUserId()
                        .equals(manager.getUserId());

        if (!assignedToManager) {
            throw new RuntimeException(
                    "You cannot view this application"
            );
        }

        return workflow;
    }

    private User getUserByRole(
            String email,
            String requiredRole
    ) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "User email is required"
            );
        }

        User user =
                userRepository
                        .findByEmail(email.trim())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        if (Boolean.FALSE.equals(
                user.getIsActive()
        )) {
            throw new RuntimeException(
                    "User account is inactive"
            );
        }

        if (user.getRole() == null
                || !requiredRole.equalsIgnoreCase(
                        user.getRole().getRoleName()
                )) {
            throw new RuntimeException(
                    "User does not have permission"
            );
        }

        return user;
    }

    private ApplicationDetailResponse toApplicationDetail(
            WorkflowRequest workflow
    ) {
        String employeeName =
                workflow.getAssignedEmployee() == null
                        ? "Not Assigned"
                        : workflow
                        .getAssignedEmployee()
                        .getFullName();

        String managerName =
                workflow.getAssignedManager() == null
                        ? "Not Assigned"
                        : workflow
                        .getAssignedManager()
                        .getFullName();

        return new ApplicationDetailResponse(
                workflow.getWorkflowId(),
                workflow.getWorkItemNumber(),
                workflow.getLoanType().getLoanName(),
                workflow.getApplicantName(),
                workflow.getApplicantEmail(),
                workflow.getApplicantPhone(),
                workflow.getLoanAmount(),
                workflow.getLoanPurpose(),
                workflow.getEmploymentType(),
                workflow.getGovernmentIdType(),
                workflow.getGovernmentIdNumber(),
                workflow.getResidentialAddress(),
                workflow.getPriority(),
                workflow.getCurrentStatus(),
                employeeName,
                managerName,
                workflow.getSubmittedAt(),
                workflow.getUpdatedAt()
        );
    }
}
