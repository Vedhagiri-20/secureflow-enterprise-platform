package com.secureflow.service;

import com.secureflow.dto.WorkflowHistoryResponse;
import com.secureflow.entity.WorkflowEvent;
import com.secureflow.entity.WorkflowRequest;
import com.secureflow.entity.WorkflowStatus;
import com.secureflow.repository.WorkflowEventRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkflowHistoryService {

    @Autowired
    private WorkflowEventRepository workflowEventRepository;

    public void record(
            WorkflowRequest workflow,
            WorkflowStatus status,
            String actorEmail,
            String actorRole
    ) {
        WorkflowEvent event = new WorkflowEvent();

        event.setWorkflow(workflow);
        event.setStatus(status.name());
        event.setActorEmail(actorEmail);
        event.setActorRole(actorRole);

        workflowEventRepository.save(event);
    }

    public List<WorkflowHistoryResponse> getHistory(
            Long workflowId
    ) {
        return workflowEventRepository
                .findByWorkflowWorkflowIdOrderByChangedAtAsc(
                        workflowId
                )
                .stream()
                .map(event -> new WorkflowHistoryResponse(
                        event.getEventId(),
                        event.getStatus(),
                        event.getActorEmail(),
                        event.getActorRole(),
                        event.getChangedAt()
                ))
                .toList();
    }
}
