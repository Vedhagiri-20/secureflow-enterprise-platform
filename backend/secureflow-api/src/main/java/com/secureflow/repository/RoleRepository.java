package com.secureflow.repository;

import com.secureflow.entity.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository
        extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleNameIgnoreCase(
            String roleName
    );
}
