package com.secureflow.controller;

import com.secureflow.dto.ReportResponse;
import com.secureflow.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/employee")
    public ReportResponse getEmployeeReport(@RequestParam String email) {
        return reportService.getEmployeeReport(email);
    }
}