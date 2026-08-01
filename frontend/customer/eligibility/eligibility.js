document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("eligibilityForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculateEligibility();
    });

});

function calculateEligibility() {

    const loanType = document.getElementById("loanType").value;
    const age = Number(document.getElementById("age").value);
    const income = Number(document.getElementById("income").value);
    const employmentType = document.getElementById("employmentType").value;
    const creditScore = Number(document.getElementById("creditScore").value);
    const existingEmi = Number(document.getElementById("existingEmi").value);
    const loanAmount = Number(document.getElementById("loanAmount").value);
    const tenure = Number(document.getElementById("tenure").value);

    const error = document.getElementById("errorMessage");
    error.innerText = "";

    if (!loanType) {
        showError("Please select a loan type.");
        return;
    }

    if (!age || age < 18 || age > 75) {
        showError("Age must be between 18 and 75.");
        return;
    }

    if (!income || income < 500 || income > 1000000) {
        showError("Monthly income must be between 500 and 1,000,000.");
        return;
    }

    if (!employmentType) {
        showError("Please select employment type.");
        return;
    }

    if (!creditScore || creditScore < 300 || creditScore > 850) {
        showError("Credit score must be between 300 and 850.");
        return;
    }

    if (existingEmi < 0 || existingEmi > 500000) {
        showError("Existing EMI must be between 0 and 500,000.");
        return;
    }

    if (existingEmi >= income) {
        showError("Existing EMI cannot be equal to or greater than monthly income.");
        return;
    }

    if (!loanAmount || loanAmount < 1000 || loanAmount > 10000000) {
        showError("Requested loan amount must be between 1,000 and 10,000,000.");
        return;
    }

    if (!tenure) {
        showError("Please select tenure.");
        return;
    }

    let score = 0;

    if (creditScore >= 750) score += 35;
    else if (creditScore >= 700) score += 28;
    else if (creditScore >= 650) score += 20;
    else if (creditScore >= 600) score += 12;
    else score += 5;

    if (income >= 8000) score += 25;
    else if (income >= 5000) score += 20;
    else if (income >= 3000) score += 14;
    else if (income >= 1500) score += 8;
    else score += 3;

    if (employmentType === "salaried") score += 15;
    else if (employmentType === "business") score += 12;
    else if (employmentType === "self-employed") score += 10;
    else score += 5;

    const emiRatio = existingEmi / income;

    if (emiRatio <= 0.2) score += 15;
    else if (emiRatio <= 0.35) score += 10;
    else if (emiRatio <= 0.5) score += 5;

    if (age >= 23 && age <= 55) score += 10;
    else if (age >= 18 && age <= 65) score += 6;
    else score += 2;

    const estimatedCapacity = Math.round((income - existingEmi) * tenure * 0.45);

    if (loanAmount > estimatedCapacity) {
        score -= 10;
    }

    if (loanType === "home" && tenure < 60) {
        score -= 5;
    }

    if (loanType === "business" && employmentType === "student") {
        score -= 10;
    }

    score = Math.max(0, Math.min(100, score));

    let riskLevel = "";
    let interestRange = "";
    let chance = "";
    let recommendation = "";

    if (score >= 80) {
        riskLevel = "Low Risk";
        interestRange = "7.5% - 9.5%";
        chance = "High Approval Chance";
        recommendation = "Strong profile. You are likely eligible for this loan range.";
    } else if (score >= 60) {
        riskLevel = "Moderate Risk";
        interestRange = "9.5% - 12.5%";
        chance = "Medium Approval Chance";
        recommendation = "Good profile. Approval may depend on document and income verification.";
    } else if (score >= 40) {
        riskLevel = "High Risk";
        interestRange = "12.5% - 16.5%";
        chance = "Low Approval Chance";
        recommendation = "Approval may be difficult. Consider reducing loan amount or improving credit score.";
    } else {
        riskLevel = "Very High Risk";
        interestRange = "Not Recommended";
        chance = "Very Low Approval Chance";
        recommendation = "Loan approval is unlikely based on the current inputs.";
    }

    const capacityText = `$${estimatedCapacity.toLocaleString()}`;

    document.getElementById("scoreResult").innerText = `${score}/100`;
    document.getElementById("chanceResult").innerText = chance;
    document.getElementById("riskResult").innerText = riskLevel;
    document.getElementById("interestResult").innerText = interestRange;
    document.getElementById("capacityResult").innerText = capacityText;
    document.getElementById("recommendationResult").innerText = recommendation;

    document.getElementById("modalScore").innerText = `${score}/100`;
    document.getElementById("modalChance").innerText = chance;
    document.getElementById("modalRisk").innerText = riskLevel;
    document.getElementById("modalInterest").innerText = interestRange;
    document.getElementById("modalCapacity").innerText = capacityText;
    document.getElementById("modalRecommendation").innerText = recommendation;

    localStorage.setItem("eligibilityScore", score);
    localStorage.setItem("eligibilityRisk", riskLevel);
    localStorage.setItem("eligibilityChance", chance);
    localStorage.setItem("eligibilityCapacity", estimatedCapacity);
    localStorage.setItem("selectedLoanType", loanType);
    localStorage.setItem("requestedLoanAmount", loanAmount);

    openEligibilityModal();
}

function showError(message) {
    document.getElementById("errorMessage").innerText = message;
}

function openEligibilityModal() {
    document.getElementById("eligibilityModal").classList.add("show");
}

function closeEligibilityModal() {
    document.getElementById("eligibilityModal").classList.remove("show");
}