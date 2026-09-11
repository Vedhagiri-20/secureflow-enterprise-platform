const API_URL = "http://localhost:8080/api/customer";

const email = localStorage.getItem("secureFlowUserEmail");
const role = localStorage.getItem("secureFlowUserRole");

if (!email || role !== "CUSTOMER") {
    window.location.href = "../../auth/login/login.html";
}

const parameters = new URLSearchParams(window.location.search);
const workflowId = parameters.get("id");

if (!workflowId) {
    showError("Application ID is missing.");
} else {
    loadApplication();
}

async function loadApplication() {
    try {
        const response = await fetch(
            `${API_URL}/applications/${workflowId}?email=${
                encodeURIComponent(email)
            }`
        );

        if (!response.ok) {
            throw new Error("Application request failed");
        }

        const application = await response.json();

        renderApplication(application);
    } catch (error) {
        showError("Unable to load application details.");
        console.error(error);
    }
}

function renderApplication(application) {
    setText("workItemNumber", application.workItemNumber);
    setText("status", formatStatus(application.status));
    setText("loanType", application.loanType);
    setText("loanAmount", formatAmount(application.loanAmount));

    setText("applicantName", application.applicantName);
    setText("applicantEmail", application.applicantEmail);
    setText("applicantPhone", application.applicantPhone);
    setText("employmentType", application.employmentType);
    setText("residentialAddress", application.residentialAddress);

    setText("loanPurpose", application.loanPurpose);
    setText("priority", application.priority);
    setText("employeeName", application.employeeName);
    setText("managerName", application.managerName);
    setText("submittedAt", formatDate(application.submittedAt));

    updateTracker(application.status);
}

function updateTracker(status) {
    const submitted = document.getElementById("stepSubmitted");
    const review = document.getElementById("stepReview");
    const manager = document.getElementById("stepManager");
    const decision = document.getElementById("stepDecision");

    submitted.classList.add("active");

    if (
        status === "UNDER_REVIEW" ||
        status === "FORWARDED_TO_MANAGER" ||
        status === "APPROVED" ||
        status === "REJECTED"
    ) {
        review.classList.add("active");
    }

    if (
        status === "FORWARDED_TO_MANAGER" ||
        status === "APPROVED"
    ) {
        manager.classList.add("active");
    }

    if (status === "APPROVED") {
        decision.classList.add("active");
    }

    if (status === "REJECTED") {
        decision.classList.add("active");
        decision.classList.add("rejected");
    }
}

function setText(id, value) {
    document.getElementById(id).textContent =
        value || "-";
}

function formatStatus(status) {
    if (!status) {
        return "-";
    }

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function formatAmount(amount) {
    if (amount === null || amount === undefined) {
        return "-";
    }

    return Number(amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString();
}

function showError(message) {
    document.getElementById("message").textContent =
        message;
}
