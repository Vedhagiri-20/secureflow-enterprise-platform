package com.secureflow.repository;

import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowRequestRepository
        extends JpaRepository<WorkflowRequest, Long> {

    long countByCreatedByUser(User user);

    long countByCreatedByUserAndCurrentStatus(
            User user,
            String currentStatus
    );

    List<WorkflowRequest> findByCreatedByUserOrderBySubmittedAtDesc(
            User user
    );

    Optional<WorkflowRequest> findByWorkflowIdAndCreatedByUser(
            Long workflowId,
            User createdByUser
    );

    long countByCurrentStatus(String currentStatus);

    List<WorkflowRequest>
            findByCurrentStatusAndAssignedEmployeeIsNullOrderBySubmittedAtAsc(
                    String currentStatus
            );

    long countByAssignedEmployee(User assignedEmployee);

    long countByAssignedEmployeeAndCurrentStatus(
            User assignedEmployee,
            String currentStatus
    );

    List<WorkflowRequest> findByAssignedEmployeeOrderByUpdatedAtDesc(
            User assignedEmployee
    );

    List<WorkflowRequest>
            findByAssignedEmployeeAndCurrentStatusOrderByUpdatedAtDesc(
                    User assignedEmployee,
                    String currentStatus
            );

    Optional<WorkflowRequest> findByWorkflowIdAndAssignedEmployee(
            Long workflowId,
            User assignedEmployee
    );

    long countByAssignedManager(User assignedManager);

    long countByAssignedManagerAndCurrentStatus(
            User assignedManager,
            String currentStatus
    );

    List<WorkflowRequest> findByAssignedManagerOrderByUpdatedAtDesc(
            User assignedManager
    );

    List<WorkflowRequest>
            findByAssignedManagerAndCurrentStatusOrderByUpdatedAtDesc(
                    User assignedManager,
                    String currentStatus
            );

    Optional<WorkflowRequest> findByWorkflowIdAndAssignedManager(
            Long workflowId,
            User assignedManager
    );
}
