package com.secureflow.controller;

import com.secureflow.dto.AdminAuditResponse;
import com.secureflow.dto.AdminCreateUserRequest;
import com.secureflow.dto.AdminDashboardResponse;
import com.secureflow.dto.AdminUserResponse;
import com.secureflow.service.AdminService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService
    ) {
        this.adminService =
                adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService
                .getDashboard();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getUsers(
            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String search
    ) {
        return adminService
                .getUsers(search);
    }

    @GetMapping("/users/{userId}")
    public AdminUserResponse getUser(
            @PathVariable Long userId
    ) {
        return adminService
                .getUser(userId);
    }

    @PostMapping("/users")
    public AdminUserResponse createUser(
            @RequestBody
            AdminCreateUserRequest request,
            Authentication authentication
    ) {
        return adminService
                .createUser(
                        request,
                        authentication.getName()
                );
    }

    @PutMapping("/users/{userId}/active")
    public AdminUserResponse updateActiveStatus(
            @PathVariable Long userId,
            @RequestParam boolean active,
            Authentication authentication
    ) {
        return adminService
                .updateActiveStatus(
                        userId,
                        active,
                        authentication.getName()
                );
    }

    @GetMapping("/audit")
    public List<AdminAuditResponse> getAudit(
            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String search
    ) {
        return adminService
                .getAuditEvents(search);
    }
}
