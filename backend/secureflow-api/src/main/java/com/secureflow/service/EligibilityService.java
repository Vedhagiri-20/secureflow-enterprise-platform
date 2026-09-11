package com.secureflow.service;

import com.secureflow.dto.EligibilityRequest;
import com.secureflow.dto.EligibilityResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;

@Service
public class EligibilityService {

    public EligibilityResponse checkEligibility(
            EligibilityRequest request
    ) {
        validateRequest(request);

        int score = 0;

        score += ageScore(request.getAge());
        score += creditScore(request.getCreditScore());
        score += incomeScore(request.getMonthlyIncome());
        score += debtScore(
                request.getMonthlyIncome(),
                request.getExistingEmi()
        );
        score += employmentScore(request.getEmploymentType());

        BigDecimal capacity = calculateCapacity(request);

        if (request.getRequestedAmount().compareTo(capacity) <= 0) {
            score += 10;
        } else if (
                request.getRequestedAmount().compareTo(
                        capacity.multiply(BigDecimal.valueOf(1.25))
                ) <= 0
        ) {
            score += 5;
        }

        score = Math.min(score, 100);

        String riskLevel;
        String interestRange;
        String recommendation;

        if (score >= 75) {
            riskLevel = "LOW";
            interestRange = "6.5% - 9.0%";
            recommendation =
                    "Strong eligibility profile. You may proceed with an application.";
        } else if (score >= 55) {
            riskLevel = "MEDIUM";
            interestRange = "9.0% - 12.5%";
            recommendation =
                    "Moderate eligibility profile. Review the requested amount before applying.";
        } else {
            riskLevel = "HIGH";
            interestRange = "12.5% - 16.0%";
            recommendation =
                    "Eligibility is currently limited. Consider reducing debt or the requested amount.";
        }

        return new EligibilityResponse(
                score,
                riskLevel,
                capacity,
                interestRange,
                recommendation
        );
    }

    private void validateRequest(EligibilityRequest request) {
        if (request.getAge() < 18) {
            throw new RuntimeException("Applicant must be at least 18");
        }

        if (request.getMonthlyIncome() <= 0) {
            throw new RuntimeException(
                    "Monthly income must be greater than zero"
            );
        }

        if (request.getExistingEmi() < 0) {
            throw new RuntimeException(
                    "Existing EMI cannot be negative"
            );
        }

        if (
                request.getCreditScore() < 300
                        || request.getCreditScore() > 900
        ) {
            throw new RuntimeException(
                    "Credit score must be between 300 and 900"
            );
        }

        if (
                request.getRequestedAmount() == null
                        || request.getRequestedAmount().signum() <= 0
        ) {
            throw new RuntimeException(
                    "Requested amount must be greater than zero"
            );
        }

        if (request.getTenureMonths() <= 0) {
            throw new RuntimeException(
                    "Loan tenure must be greater than zero"
            );
        }
    }

    private int ageScore(int age) {
        if (age >= 21 && age <= 60) {
            return 15;
        }

        if (age <= 65) {
            return 8;
        }

        return 3;
    }

    private int creditScore(int creditScore) {
        if (creditScore >= 750) {
            return 30;
        }

        if (creditScore >= 700) {
            return 25;
        }

        if (creditScore >= 650) {
            return 15;
        }

        return 5;
    }

    private int incomeScore(double monthlyIncome) {
        if (monthlyIncome >= 5000) {
            return 20;
        }

        if (monthlyIncome >= 3000) {
            return 15;
        }

        if (monthlyIncome >= 2000) {
            return 10;
        }

        return 5;
    }

    private int debtScore(
            double monthlyIncome,
            double existingEmi
    ) {
        double ratio = existingEmi / monthlyIncome;

        if (ratio <= 0.30) {
            return 20;
        }

        if (ratio <= 0.40) {
            return 15;
        }

        if (ratio <= 0.50) {
            return 8;
        }

        return 0;
    }

    private int employmentScore(String employmentType) {
        if (employmentType == null) {
            return 0;
        }

        if (
                employmentType.equalsIgnoreCase("Salaried")
                        || employmentType.equalsIgnoreCase(
                                "Business Owner"
                        )
        ) {
            return 5;
        }

        if (
                employmentType.equalsIgnoreCase("Self Employed")
        ) {
            return 4;
        }

        return 2;
    }

    private BigDecimal calculateCapacity(
            EligibilityRequest request
    ) {
        double availableMonthlyPayment =
                request.getMonthlyIncome() * 0.40
                        - request.getExistingEmi();

        availableMonthlyPayment =
                Math.max(availableMonthlyPayment, 0);

        double totalCapacity =
                availableMonthlyPayment
                        * request.getTenureMonths();

        return BigDecimal.valueOf(totalCapacity)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
