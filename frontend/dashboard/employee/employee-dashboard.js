
checkAuthentication("EMPLOYEE");
console.log("Employee Verification Dashboard Loaded");

document.addEventListener("DOMContentLoaded", async function () {

    const savedEmail =
        sessionStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    const savedName =
        sessionStorage.getItem("secureFlowUserName") ||
        getNameFromEmail(savedEmail);

    setUserProfile(savedName);

    await loadEmployeeDashboard(savedEmail);
});

function getNameFromEmail(email) {
    if (!email || !email.includes("@")) return "User";

    return email
        .split("@")[0]
        .replace(/[0-9._-]/g, " ")
        .trim()
        .split(" ")[0] || "User";
}

function formatShortName(name) {
    if (!name) return "User";
    return name.trim().length <= 5 ? name.trim() : name.trim().substring(0, 5);
}

function setUserProfile(name) {
    const displayName = formatShortName(name);

    document.getElementById("welcomeText").innerText = `Hi ${displayName}!`;
    document.getElementById("userAvatar").innerText =
        displayName.charAt(0).toUpperCase();
}

async function loadEmployeeDashboard(email) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/dashboard/employee?email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        const pending = data.pending || 0;
        const forwarded = data.approved || 0;
        const rejected = data.rejected || 0;
        const total = data.total || 0;

        document.getElementById("pendingCount").innerText = pending;
        document.getElementById("forwardedCount").innerText = forwarded;
        document.getElementById("rejectedCount").innerText = rejected;

        document.getElementById("totalApplicationCount").innerText = total;
        document.getElementById("pendingApplicationCount").innerText = pending;
        document.getElementById("donutTotalCount").innerText = total;

        document.getElementById("pendingLegend").innerHTML =
            `<span class="dot pending-dot"></span> Pending - ${pending}`;

        document.getElementById("forwardedLegend").innerHTML =
            `<span class="dot approved-dot"></span> Forwarded - ${forwarded}`;

        document.getElementById("rejectedLegend").innerHTML =
            `<span class="dot rejected-dot"></span> Rejected - ${rejected}`;

        const health =
            total === 0 ? 0 : Math.round((forwarded / total) * 100);

        document.getElementById("workflowHealth").innerText = `${health}%`;

        document.getElementById("teamUpdateText").innerText =
            pending > 0
                ? `${pending} applications need employee verification.`
                : "No pending employee verification items.";

    } catch (error) {
        console.error("Dashboard API Error:", error);

        document.getElementById("teamUpdateText").innerText =
            "Unable to load dashboard data. Start Spring Boot server.";
    }
}

async function quickSearch() {
    const workItemNumber =
        document.getElementById("workItemSearch").value.trim();

    const loanType =
        document.getElementById("loanTypeSearch").value;

    const message =
        document.getElementById("searchMessage");

    const savedEmail =
        sessionStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    message.innerText = "";

    if (workItemNumber === "" && loanType === "") {
        message.innerText = "Enter application ID, work item number, or select loan type.";
        return;
    }

    try {
        const params = new URLSearchParams();

        params.append("email", savedEmail);

        if (workItemNumber !== "") {
            params.append("query", workItemNumber);
        }

        if (loanType !== "") {
            params.append("loanType", loanType);
        }

        const response = await fetch(
            `http://localhost:8080/api/workflows/search?${params.toString()}`
        );

        if (!response.ok) {
            message.innerText = "No application found for your search.";
            return;
        }

        const workflow = await response.json();

        openWorkflowModal(workflow);

    } catch (error) {
        console.error("Quick Search Error:", error);
        message.innerText = "Unable to search. Please start Spring Boot server.";
    }
}

function openWorkflowModal(workflow) {
    document.getElementById("modalWorkItem").innerText =
        workflow.workItemNumber || workflow.applicationId || "-";

    document.getElementById("modalLoanType").innerText =
        workflow.loanType || "-";

    document.getElementById("modalStatus").innerText =
        workflow.status || "-";

    document.getElementById("modalApplicant").innerText =
        workflow.applicantName || workflow.customerName || "-";

    document.getElementById("modalEmail").innerText =
        workflow.applicantEmail || workflow.customerEmail || "-";

    document.getElementById("modalPhone").innerText =
        workflow.applicantPhone || workflow.customerPhone || "-";

    document.getElementById("modalAmount").innerText =
        workflow.loanAmount
            ? "$" + Number(workflow.loanAmount).toLocaleString()
            : "-";

    document.getElementById("modalEligibility").innerText =
        workflow.eligibilityScore || "Not checked";

    document.getElementById("modalRisk").innerText =
        workflow.eligibilityRisk || "Not checked";

    document.getElementById("modalCreatedDate").innerText =
        workflow.createdDate
            ? formatDate(workflow.createdDate)
            : "-";

    document.getElementById("modalPurpose").innerText =
        workflow.loanPurpose || "-";

    document.getElementById("workflowModal").classList.add("show");
}

function closeWorkflowModal() {
    document.getElementById("workflowModal").classList.remove("show");
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}