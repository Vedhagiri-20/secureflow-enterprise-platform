package com.secureflow.dto;

import java.math.BigDecimal;

public class EligibilityResponse {

    private final int eligibilityScore;
    private final String riskLevel;
    private final BigDecimal suggestedCapacity;
    private final String interestRange;
    private final String recommendation;

    public EligibilityResponse(
            int eligibilityScore,
            String riskLevel,
            BigDecimal suggestedCapacity,
            String interestRange,
            String recommendation
    ) {
        this.eligibilityScore = eligibilityScore;
        this.riskLevel = riskLevel;
        this.suggestedCapacity = suggestedCapacity;
        this.interestRange = interestRange;
        this.recommendation = recommendation;
    }

    public int getEligibilityScore() {
        return eligibilityScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public BigDecimal getSuggestedCapacity() {
        return suggestedCapacity;
    }

    public String getInterestRange() {
        return interestRange;
    }

    public String getRecommendation() {
        return recommendation;
    }
}
