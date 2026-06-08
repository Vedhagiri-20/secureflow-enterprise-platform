console.log("Employee Dashboard Loaded");

document.addEventListener("DOMContentLoaded", async function () {

    const savedEmail =
        localStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    const savedName =
        localStorage.getItem("secureFlowUserName") ||
        getNameFromEmail(savedEmail);

    setUserProfile(savedName);

    await loadEmployeeDashboard(savedEmail);
});

function getNameFromEmail(email) {

    if (!email || !email.includes("@")) {
        return "User";
    }

    const namePart = email.split("@")[0];

    return namePart
        .replace(/[0-9._-]/g, " ")
        .trim()
        .split(" ")[0] || "User";
}

function formatShortName(name) {

    if (!name) {
        return "User";
    }

    const cleanName = name.trim();

    if (cleanName.length <= 5) {
        return cleanName;
    }

    return cleanName.substring(0, 5);
}

function setUserProfile(name) {

    const welcomeText = document.getElementById("welcomeText");
    const avatar = document.getElementById("userAvatar");

    const displayName = formatShortName(name);

    welcomeText.innerText = `Hi ${displayName}!`;
    avatar.innerText = displayName.charAt(0).toUpperCase();
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

        document.getElementById("pendingCount").innerText = data.pending;
        document.getElementById("approvedCount").innerText = data.approved;
        document.getElementById("rejectedCount").innerText = data.rejected;

        document.getElementById("totalWorkflowCount").innerText = data.total;
        document.getElementById("pendingWorkflowCount").innerText = data.pending;
        document.getElementById("donutTotalCount").innerText = data.total;

        document.getElementById("pendingLegend").innerHTML =
            `<span class="dot pending-dot"></span> Pending - ${data.pending}`;

        document.getElementById("approvedLegend").innerHTML =
            `<span class="dot approved-dot"></span> Approved - ${data.approved}`;

        document.getElementById("rejectedLegend").innerHTML =
            `<span class="dot rejected-dot"></span> Rejected - ${data.rejected}`;

        const health =
            data.total === 0
                ? 0
                : Math.round((data.approved / data.total) * 100);

        document.getElementById("workflowHealth").innerText = `${health}%`;

        document.getElementById("teamUpdateText").innerText =
            `${data.pending} pending workflows need review.`;

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
        localStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    message.innerText = "";

    if (workItemNumber === "" && loanType === "") {
        message.innerText = "Enter work item number or select loan type.";
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
            message.innerText = "No workflow found for your search.";
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
        workflow.workItemNumber || "-";

    document.getElementById("modalLoanType").innerText =
        workflow.loanType || "-";

    document.getElementById("modalStatus").innerText =
        workflow.status || "-";

    document.getElementById("modalApplicant").innerText =
        workflow.applicantName || "-";

    document.getElementById("modalEmail").innerText =
        workflow.applicantEmail || "-";

    document.getElementById("modalPhone").innerText =
        workflow.applicantPhone || "-";

    document.getElementById("modalAmount").innerText =
        workflow.loanAmount
            ? "$" + Number(workflow.loanAmount).toLocaleString()
            : "-";

    document.getElementById("modalPriority").innerText =
        workflow.priority || "-";

    document.getElementById("modalManager").innerText =
        workflow.managerName || "-";

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

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}