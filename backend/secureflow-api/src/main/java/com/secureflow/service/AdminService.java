package com.secureflow.service;

import com.secureflow.dto.AdminAuditResponse;
import com.secureflow.dto.AdminCreateUserRequest;
import com.secureflow.dto.AdminDashboardResponse;
import com.secureflow.dto.AdminUserResponse;
import com.secureflow.entity.AuditEvent;
import com.secureflow.entity.Role;
import com.secureflow.entity.User;
import com.secureflow.entity.WorkflowEvent;
import com.secureflow.repository.AuditEventRepository;
import com.secureflow.repository.RoleRepository;
import com.secureflow.repository.UserRepository;
import com.secureflow.repository.WorkflowEventRepository;
import com.secureflow.repository.WorkflowRequestRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final WorkflowRequestRepository workflowRequestRepository;
    private final AuditEventRepository auditEventRepository;
    private final WorkflowEventRepository workflowEventRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AdminService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            WorkflowRequestRepository workflowRequestRepository,
            AuditEventRepository auditEventRepository,
            WorkflowEventRepository workflowEventRepository,
            PasswordEncoder passwordEncoder,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.workflowRequestRepository =
                workflowRequestRepository;
        this.auditEventRepository =
                auditEventRepository;
        this.workflowEventRepository =
                workflowEventRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public AdminDashboardResponse getDashboard() {
        List<User> users =
                userRepository.findAll();

        long activeUsers =
                users.stream()
                        .filter(user ->
                                Boolean.TRUE.equals(
                                        user.getIsActive()
                                )
                        )
                        .count();

        long customers =
                countRole(users, "CUSTOMER");

        long employees =
                countRole(users, "EMPLOYEE");

        long managers =
                countRole(users, "MANAGER");

        long totalApplications =
                workflowRequestRepository.count();

        long totalAuditEvents =
                auditEventRepository.count()
                        + workflowEventRepository.count();

        List<AdminAuditResponse> recentActivities =
                getAuditEvents("")
                        .stream()
                        .limit(10)
                        .toList();

        return new AdminDashboardResponse(
                users.size(),
                activeUsers,
                customers,
                employees,
                managers,
                totalApplications,
                totalAuditEvents,
                recentActivities
        );
    }

    public List<AdminUserResponse> getUsers(
            String search
    ) {
        String query =
                normalize(search);

        return userRepository
                .findAll()
                .stream()
                .filter(user ->
                        matchesUser(
                                user,
                                query
                        )
                )
                .sorted(
                        Comparator.comparing(
                                user ->
                                        safe(
                                                user.getFullName()
                                        ).toLowerCase()
                        )
                )
                .map(this::toUserResponse)
                .toList();
    }

    public AdminUserResponse getUser(
            Long userId
    ) {
        return toUserResponse(
                findUser(userId)
        );
    }

    public AdminUserResponse createUser(
            AdminCreateUserRequest request,
            String adminEmail
    ) {
        validateCreateRequest(request);

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository
                .existsByEmailIgnoreCase(email)) {
            throw new RuntimeException(
                    "A user with this email already exists"
            );
        }

        Role role =
                roleRepository
                        .findByRoleNameIgnoreCase(
                                request.getRole().trim()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Role not found"
                                        )
                        );

        User user =
                new User();

        user.setFullName(
                request.getFullName().trim()
        );

        user.setEmail(email);

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(role);

        user.setPhoneNumber(
                normalizeNullable(
                        request.getPhoneNumber()
                )
        );

        user.setDepartment(
                normalizeNullable(
                        request.getDepartment()
                )
        );

        user.setIsActive(true);

        user.setCreatedAt(
                LocalDateTime.now()
        );

        User saved =
                userRepository.save(user);

        User admin =
                getAdmin(adminEmail);

        auditService.record(
                admin,
                "ADMIN_CREATED_USER",
                "Created "
                        + role.getRoleName()
                        + " account for "
                        + email
        );

        return toUserResponse(saved);
    }

    public AdminUserResponse updateActiveStatus(
            Long userId,
            boolean active,
            String adminEmail
    ) {
        User admin =
                getAdmin(adminEmail);

        User target =
                findUser(userId);

        if (target.getUserId()
                .equals(admin.getUserId())
                && !active) {
            throw new RuntimeException(
                    "You cannot disable your own administrator account"
            );
        }

        target.setIsActive(active);

        User saved =
                userRepository.save(target);

        auditService.record(
                admin,
                active
                        ? "ADMIN_ENABLED_USER"
                        : "ADMIN_DISABLED_USER",
                (active
                        ? "Enabled access for "
                        : "Disabled access for ")
                        + target.getEmail()
        );

        return toUserResponse(saved);
    }

    public List<AdminAuditResponse> getAuditEvents(
            String search
    ) {
        String query =
                normalize(search);

        List<AdminAuditResponse> events =
                new ArrayList<>();

        for (AuditEvent event :
                auditEventRepository
                        .findAllByOrderByCreatedAtDesc()) {

            events.add(
                    new AdminAuditResponse(
                            "A-"
                                    + event.getAuditEventId(),
                            event.getActorEmail(),
                            event.getActorRole(),
                            event.getAction(),
                            event.getDetails(),
                            null,
                            event.getCreatedAt()
                    )
            );
        }

        for (WorkflowEvent event :
                workflowEventRepository
                        .findAllByOrderByChangedAtDesc()) {

            Long workflowId =
                    event.getWorkflow() == null
                            ? null
                            : event.getWorkflow()
                                    .getWorkflowId();

            String workItemNumber =
                    event.getWorkflow() == null
                            ? "Unknown"
                            : event.getWorkflow()
                                    .getWorkItemNumber();

            events.add(
                    new AdminAuditResponse(
                            "W-"
                                    + event.getEventId(),
                            event.getActorEmail(),
                            event.getActorRole(),
                            workflowAction(
                                    event.getStatus()
                            ),
                            "Application "
                                    + workItemNumber
                                    + " changed to "
                                    + event.getStatus(),
                            workflowId,
                            event.getChangedAt()
                    )
            );
        }

        return events.stream()
                .sorted(
                        Comparator.comparing(
                                AdminAuditResponse::getCreatedAt,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )
                        )
                )
                .filter(event ->
                        matchesAudit(
                                event,
                                query
                        )
                )
                .toList();
    }

    private long countRole(
            List<User> users,
            String roleName
    ) {
        return users.stream()
                .filter(user ->
                        user.getRole() != null
                                && roleName.equalsIgnoreCase(
                                        user.getRole()
                                                .getRoleName()
                                )
                )
                .count();
    }

    private boolean matchesUser(
            User user,
            String query
    ) {
        if (query.isBlank()) {
            return true;
        }

        return contains(
                user.getFullName(),
                query
        )
                || contains(
                        user.getEmail(),
                        query
                )
                || (
                        user.getRole() != null
                                && contains(
                                        user.getRole()
                                                .getRoleName(),
                                        query
                                )
                )
                || contains(
                        user.getDepartment(),
                        query
                );
    }

    private boolean matchesAudit(
            AdminAuditResponse event,
            String query
    ) {
        if (query.isBlank()) {
            return true;
        }

        return contains(
                event.getActorEmail(),
                query
        )
                || contains(
                        event.getActorRole(),
                        query
                )
                || contains(
                        event.getAction(),
                        query
                )
                || contains(
                        event.getDetails(),
                        query
                )
                || (
                        event.getWorkflowId() != null
                                && String.valueOf(
                                        event.getWorkflowId()
                                ).contains(query)
                );
    }

    private User findUser(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "User not found"
                                )
                );
    }

    private User getAdmin(
            String email
    ) {
        User admin =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Administrator not found"
                                        )
                        );

        if (admin.getRole() == null
                || !"ADMIN".equalsIgnoreCase(
                        admin.getRole()
                                .getRoleName()
                )) {
            throw new RuntimeException(
                    "Administrator access required"
            );
        }

        return admin;
    }

    private AdminUserResponse toUserResponse(
            User user
    ) {
        String role =
                user.getRole() == null
                        ? "UNKNOWN"
                        : user.getRole()
                                .getRoleName();

        return new AdminUserResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                role,
                user.getPhoneNumber(),
                user.getDepartment(),
                user.getIsActive(),
                user.getLastLoginAt(),
                user.getCreatedAt(),
                passwordStatus(
                        user.getPasswordHash()
                )
        );
    }

    private String passwordStatus(
            String passwordHash
    ) {
        if (passwordHash == null
                || passwordHash.isBlank()) {
            return "Password unavailable";
        }

        if (passwordHash.startsWith("$2a$")
                || passwordHash.startsWith("$2b$")
                || passwordHash.startsWith("$2y$")) {
            return "BCrypt protected — original password unavailable";
        }

        return "Legacy password — secured automatically at next login";
    }

    private void validateCreateRequest(
            AdminCreateUserRequest request
    ) {
        if (request.getFullName() == null
                || request.getFullName()
                        .isBlank()) {
            throw new RuntimeException(
                    "Full name is required"
            );
        }

        if (request.getEmail() == null
                || request.getEmail()
                        .isBlank()) {
            throw new RuntimeException(
                    "Email is required"
            );
        }

        if (!request.getEmail()
                .contains("@")) {
            throw new RuntimeException(
                    "Enter a valid email"
            );
        }

        if (request.getPassword() == null
                || request.getPassword()
                        .length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters"
            );
        }

        if (request.getRole() == null
                || request.getRole()
                        .isBlank()) {
            throw new RuntimeException(
                    "Role is required"
            );
        }
    }

    private String workflowAction(
            String status
    ) {
        if (status == null) {
            return "WORKFLOW_UPDATED";
        }

        return switch (status.toUpperCase()) {
            case "SUBMITTED" ->
                    "APPLICATION_SUBMITTED";

            case "UNDER_REVIEW" ->
                    "EMPLOYEE_STARTED_REVIEW";

            case "FORWARDED_TO_MANAGER" ->
                    "APPLICATION_FORWARDED";

            case "APPROVED" ->
                    "APPLICATION_APPROVED";

            case "REJECTED" ->
                    "APPLICATION_REJECTED";

            default ->
                    "WORKFLOW_" + status.toUpperCase();
        };
    }

    private String normalize(
            String value
    ) {
        if (value == null) {
            return "";
        }

        return value
                .trim()
                .toLowerCase();
    }

    private String normalizeNullable(
            String value
    ) {
        if (value == null
                || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private boolean contains(
            String value,
            String query
    ) {
        return value != null
                && value.toLowerCase()
                        .contains(query);
    }

    private String safe(
            String value
    ) {
        return value == null
                ? ""
                : value;
    }
}
