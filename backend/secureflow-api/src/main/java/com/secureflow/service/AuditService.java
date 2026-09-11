package com.secureflow.service;

import com.secureflow.entity.AuditEvent;
import com.secureflow.entity.User;
import com.secureflow.repository.AuditEventRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    public AuditService(
            AuditEventRepository auditEventRepository
    ) {
        this.auditEventRepository =
                auditEventRepository;
    }

    public void record(
            User user,
            String action,
            String details
    ) {
        AuditEvent event =
                new AuditEvent();

        event.setActorEmail(
                user.getEmail()
        );

        event.setActorRole(
                user.getRole() == null
                        ? "UNKNOWN"
                        : user.getRole().getRoleName()
        );

        event.setAction(action);
        event.setDetails(details);

        auditEventRepository.save(event);
    }
}
