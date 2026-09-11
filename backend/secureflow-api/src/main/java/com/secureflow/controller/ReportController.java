package com.secureflow.controller;

import com.secureflow.dto.ReportResponse;
import com.secureflow.service.ReportService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Provides authenticated employee reporting.
 */
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {
        this.reportService =
                reportService;
    }

    @GetMapping("/employee")
    public ReportResponse getEmployeeReport(
            Authentication authentication
    ) {
        return reportService.getEmployeeReport(
                authentication.getName()
        );
    }
}
