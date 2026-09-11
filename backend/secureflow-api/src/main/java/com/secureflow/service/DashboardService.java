package com.secureflow.service;

import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkflowRequestRepository workflowRequestRepository;

    public EmployeeDashboardResponse getEmployeeDashboard(String email) {
        User employee = getEmployee(email);

        long available = workflowRequestRepository
                .findByCurrentStatusAndAssignedEmployeeIsNullOrderBySubmittedAtAsc(
                        WorkflowStatus.SUBMITTED.name()
                )
                .size();

        long assigned = workflowRequestRepository
                .countByAssignedEmployee(employee);

        long underReview = workflowRequestRepository
                .countByAssignedEmployeeAndCurrentStatus(
                        employee,
                        WorkflowStatus.UNDER_REVIEW.name()
                );

        long forwarded = workflowRequestRepository
                .countByAssignedEmployeeAndCurrentStatus(
                        employee,
                        WorkflowStatus.FORWARDED_TO_MANAGER.name()
                );

        long rejected = workflowRequestRepository
                .countByAssignedEmployeeAndCurrentStatus(
                        employee,
                        WorkflowStatus.REJECTED.name()
                );

        return new EmployeeDashboardResponse(
                available,
                assigned,
                underReview,
                forwarded,
                rejected
        );
    }

    private User getEmployee(String email) {
        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getRole() == null
                || !"EMPLOYEE".equalsIgnoreCase(
                        employee.getRole().getRoleName()
                )) {
            throw new RuntimeException("User is not an employee");
        }

        return employee;
    }
}
