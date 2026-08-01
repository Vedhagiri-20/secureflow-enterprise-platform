document.addEventListener("DOMContentLoaded", function () {
    loadCustomerDetails();
    loadEligibilityDetails();

    document.getElementById("applicationForm").addEventListener("submit", function (event) {
        event.preventDefault();
        submitApplication();
    });
});

function loadCustomerDetails() {
    const name =
        localStorage.getItem("customerName") ||
        localStorage.getItem("secureFlowUserName") ||
        "";

    const email =
        localStorage.getItem("customerEmail") ||
        localStorage.getItem("secureFlowUserEmail") ||
        "";

    const phone =
        localStorage.getItem("customerPhone") ||
        "";

    document.getElementById("fullName").value = name;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;
}

function loadEligibilityDetails() {
    const score = localStorage.getItem("eligibilityScore");
    const risk = localStorage.getItem("eligibilityRisk");
    const chance = localStorage.getItem("eligibilityChance");
    const capacity = localStorage.getItem("eligibilityCapacity");
    const selectedLoanType = localStorage.getItem("selectedLoanType");
    const requestedLoanAmount = localStorage.getItem("requestedLoanAmount");

    if (score && risk && chance && capacity) {
        document.getElementById("summaryScore").innerText = `${score}/100`;
        document.getElementById("summaryRisk").innerText = risk;
        document.getElementById("summaryChance").innerText = chance;
        document.getElementById("summaryCapacity").innerText = `$${Number(capacity).toLocaleString()}`;

        document.getElementById("eligibilityNotice").innerHTML =
            `Eligibility data loaded successfully. You can continue your application.`;

        if (selectedLoanType) {
            document.getElementById("loanType").value = selectedLoanType;
        }

        if (requestedLoanAmount) {
            document.getElementById("loanAmount").value = requestedLoanAmount;
        }
    }
}

function submitApplication() {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const loanType = document.getElementById("loanType").value;
    const loanAmount = Number(document.getElementById("loanAmount").value);
    const tenure = document.getElementById("tenure").value;
    const employmentType = document.getElementById("employmentType").value;
    const loanPurpose = document.getElementById("loanPurpose").value.trim();

    const error = document.getElementById("errorMessage");
    error.innerText = "";

    if (!fullName) {
        error.innerText = "Full name is required.";
        return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        error.innerText = "Valid email address is required.";
        return;
    }

    if (!phone || phone.length < 8 || phone.length > 15) {
        error.innerText = "Valid phone number is required.";
        return;
    }

    if (!loanType) {
        error.innerText = "Please select loan type.";
        return;
    }

    if (!loanAmount || loanAmount < 1000 || loanAmount > 10000000) {
        error.innerText = "Loan amount must be between 1,000 and 10,000,000.";
        return;
    }

    if (!tenure) {
        error.innerText = "Please select tenure.";
        return;
    }

    if (!employmentType) {
        error.innerText = "Please select employment type.";
        return;
    }

    if (!loanPurpose) {
        error.innerText = "Loan purpose is required.";
        return;
    }

    const applications = JSON.parse(localStorage.getItem("customerLoanApplications")) || [];

    const applicationId = generateApplicationId(applications.length + 1);

    const application = {
        applicationId: applicationId,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        loanType: getLoanTypeName(loanType),
        loanTypeCode: loanType,
        loanAmount: loanAmount,
        tenure: tenure,
        employmentType: employmentType,
        loanPurpose: loanPurpose,
        eligibilityScore: localStorage.getItem("eligibilityScore") || "Not checked",
        eligibilityRisk: localStorage.getItem("eligibilityRisk") || "Not checked",
        eligibilityChance: localStorage.getItem("eligibilityChance") || "Not checked",
        eligibilityCapacity: localStorage.getItem("eligibilityCapacity") || "Not checked",
        status: "Pending Employee Review",
        currentStage: "Employee Review",
        createdDate: new Date().toISOString()
    };

    applications.unshift(application);

    localStorage.setItem("customerLoanApplications", JSON.stringify(applications));

    localStorage.setItem("customerName", fullName);
    localStorage.setItem("customerEmail", email);
    localStorage.setItem("customerPhone", phone);

    document.getElementById("modalApplicationId").innerText = applicationId;
    document.getElementById("successModal").classList.add("show");

    document.getElementById("applicationForm").reset();
}

function generateApplicationId(number) {
    return `APP-${String(number).padStart(4, "0")}`;
}

function getLoanTypeName(code) {
    const loanTypes = {
        home: "Home Loan",
        car: "Car Loan",
        education: "Education Loan",
        business: "Business Loan"
    };

    return loanTypes[code] || "Loan";
}