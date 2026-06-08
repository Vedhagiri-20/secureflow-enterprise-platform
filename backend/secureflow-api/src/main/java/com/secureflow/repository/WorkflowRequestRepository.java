package com.secureflow.repository;

import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkflowRequestRepository extends JpaRepository<WorkflowRequest, Long> {

    long countByCreatedByUser(User user);

    long countByCreatedByUserAndCurrentStatus(User user, String currentStatus);

    List<WorkflowRequest> findByCreatedByUserOrderBySubmittedAtDesc(User user);
}