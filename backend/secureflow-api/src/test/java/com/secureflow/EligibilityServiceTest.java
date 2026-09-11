package com.secureflow;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.secureflow.dto.EligibilityRequest;
import com.secureflow.dto.EligibilityResponse;
import com.secureflow.service.EligibilityService;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EligibilityServiceTest {

    private EligibilityService eligibilityService;

    @BeforeEach
    void setUp() {
        eligibilityService =
                new EligibilityService();
    }

    @Test
    void strongApplicantReceivesHighScore() {
        EligibilityRequest request =
                createRequest();

        EligibilityResponse response =
                eligibilityService
                        .checkEligibility(request);

        assertTrue(
                response.getEligibilityScore() >= 75
        );

        assertEquals(
                "LOW",
                response.getRiskLevel()
        );
    }

    @Test
    void scoreNeverExceedsOneHundred() {
        EligibilityRequest request =
                createRequest();

        EligibilityResponse response =
                eligibilityService
                        .checkEligibility(request);

        assertTrue(
                response.getEligibilityScore() <= 100
        );
    }

    @Test
    void applicantMustBeAtLeastEighteen() {
        EligibilityRequest request =
                createRequest();

        request.setAge(17);

        assertThrows(
                RuntimeException.class,
                () -> eligibilityService
                        .checkEligibility(request)
        );
    }

    private EligibilityRequest createRequest() {
        EligibilityRequest request =
                new EligibilityRequest();

        request.setLoanType("Home Loan");
        request.setAge(30);
        request.setMonthlyIncome(6000);
        request.setEmploymentType("Salaried");
        request.setCreditScore(780);
        request.setExistingEmi(300);
        request.setRequestedAmount(
                BigDecimal.valueOf(50000)
        );
        request.setTenureMonths(60);

        return request;
    }
}
