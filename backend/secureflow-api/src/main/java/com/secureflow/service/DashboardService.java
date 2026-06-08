package com.secureflow.service;

import com.secureflow.dto.EmployeeDashboardResponse;
import com.secureflow.entity.User;
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

        User employee = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        long total = workflowRequestRepository.countByCreatedByUser(employee);
        long pending = workflowRequestRepository.countByCreatedByUserAndCurrentStatus(employee, "Pending");
        long approved = workflowRequestRepository.countByCreatedByUserAndCurrentStatus(employee, "Approved");
        long rejected = workflowRequestRepository.countByCreatedByUserAndCurrentStatus(employee, "Rejected");

        return new EmployeeDashboardResponse(total, pending, approved, rejected);
    }
}