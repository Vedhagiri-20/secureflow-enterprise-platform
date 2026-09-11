package com.secureflow.repository;

import com.secureflow.entity.WorkflowEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowEventRepository
        extends JpaRepository<WorkflowEvent, Long> {

    List<WorkflowEvent>
            findByWorkflowWorkflowIdOrderByChangedAtAsc(
                    Long workflowId
            );
}
