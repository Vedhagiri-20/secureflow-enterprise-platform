package com.secureflow.controller;

import com.secureflow.dto.EligibilityRequest;
import com.secureflow.dto.EligibilityResponse;
import com.secureflow.service.EligibilityService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(
            EligibilityService eligibilityService
    ) {
        this.eligibilityService =
                eligibilityService;
    }

    @PostMapping("/check")
    public EligibilityResponse checkEligibility(
            @RequestBody EligibilityRequest request
    ) {
        return eligibilityService
                .checkEligibility(request);
    }
}
