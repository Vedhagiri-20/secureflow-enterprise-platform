package com.secureflow.repository;

import com.secureflow.entity.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {
}