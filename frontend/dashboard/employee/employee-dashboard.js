const API_URL = "http://localhost:8080/api/employee";

const employeeEmail = localStorage.getItem("secureFlowUserEmail");
const employeeRole = localStorage.getItem("secureFlowUserRole");

if (!employeeEmail || employeeRole !== "EMPLOYEE") {
    window.location.href = "../../auth/login/login.html";
}

document.getElementById("employeeEmail").textContent =
    employeeEmail || "";

async function loadPage() {
    clearMessage();

    try {
        await Promise.all([
            loadDashboard(),
            loadAvailableApplications(),
            loadAssignedApplications()
        ]);
    } catch (error) {
        showMessage(
            "Unable to load employee data. Check the backend."
        );
        console.error(error);
    }
}

async function loadDashboard() {
    const response = await fetch(
        `${API_URL}/dashboard?email=${encodeURIComponent(employeeEmail)}`
    );

    if (!response.ok) {
        throw new Error("Dashboard request failed");
    }

    const data = await response.json();

    document.getElementById("availableCount").textContent =
        data.available;

    document.getElementById("assignedCount").textContent =
        data.assigned;

    document.getElementById("reviewCount").textContent =
        data.underReview;

    document.getElementById("forwardedCount").textContent =
        data.forwarded;

    document.getElementById("rejectedCount").textContent =
        data.rejected;
}

async function loadAvailableApplications() {
    const response = await fetch(
        `${API_URL}/applications/available?email=${
            encodeURIComponent(employeeEmail)
        }`
    );

    if (!response.ok) {
        throw new Error("Available applications request failed");
    }

    const applications = await response.json();

    renderAvailableApplications(applications);
}

async function loadAssignedApplications() {
    const response = await fetch(
        `${API_URL}/applications?email=${
            encodeURIComponent(employeeEmail)
        }`
    );

    if (!response.ok) {
        throw new Error("Assigned applications request failed");
    }

    const applications = await response.json();

    renderAssignedApplications(applications);
}

function renderAvailableApplications(applications) {
    const table = document.getElementById("availableTable");

    if (applications.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No new applications are waiting for review.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = applications
        .map(application => `
            <tr>
                <td>${escapeHtml(application.workItemNumber)}</td>
                <td>${escapeHtml(application.applicantName)}</td>
                <td>${escapeHtml(application.loanType)}</td>
                <td>${formatAmount(application.loanAmount)}</td>
                <td>${escapeHtml(application.priority || "-")}</td>
                <td>
                    <button
                        class="action-button review-button"
                        onclick="startReview(${application.workflowId})"
                    >
                        Start Review
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

function renderAssignedApplications(applications) {
    const table = document.getElementById("assignedTable");

    if (applications.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    You do not have any assigned applications.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = applications
        .map(application => `
            <tr>
                <td>${escapeHtml(application.workItemNumber)}</td>
                <td>${escapeHtml(application.applicantName)}</td>
                <td>${escapeHtml(application.loanType)}</td>
                <td>${formatAmount(application.loanAmount)}</td>
                <td>
                    <span class="status">
                        ${formatStatus(application.status)}
                    </span>
                </td>
                <td>
                    ${renderActions(application)}
                </td>
            </tr>
        `)
        .join("");
}

function renderActions(application) {
    if (application.status !== "UNDER_REVIEW") {
        return "-";
    }

    return `
        <div class="action-group">
            <button
                class="action-button forward-button"
                onclick="forwardApplication(${application.workflowId})"
            >
                Forward
            </button>

            <button
                class="action-button reject-button"
                onclick="rejectApplication(${application.workflowId})"
            >
                Reject
            </button>
        </div>
    `;
}

async function startReview(workflowId) {
    await performAction(
        workflowId,
        "review",
        "Application assigned to you."
    );
}

async function forwardApplication(workflowId) {
    const confirmed = window.confirm(
        "Forward this application to the manager?"
    );

    if (!confirmed) {
        return;
    }

    await performAction(
        workflowId,
        "forward",
        "Application forwarded to the manager."
    );
}

async function rejectApplication(workflowId) {
    const confirmed = window.confirm(
        "Reject this application?"
    );

    if (!confirmed) {
        return;
    }

    await performAction(
        workflowId,
        "reject",
        "Application rejected."
    );
}

async function performAction(workflowId, action, successMessage) {
    clearMessage();

    try {
        const response = await fetch(
            `${API_URL}/applications/${workflowId}/${action}?email=${
                encodeURIComponent(employeeEmail)
            }`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || "Action failed");
        }

        showSuccess(successMessage);

        await loadPage();
    } catch (error) {
        showMessage("Unable to update application.");
        console.error(error);
    }
}

function formatAmount(amount) {
    return Number(amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    });
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

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value || "-";
    return element.innerHTML;
}

function clearMessage() {
    const message = document.getElementById("message");
    message.textContent = "";
    message.style.color = "#ff8888";
}

function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.color = "#ff8888";
}

function showSuccess(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.color = "#45dfbb";
}

function logout() {
    localStorage.removeItem("secureFlowUserEmail");
    localStorage.removeItem("secureFlowUserRole");

    window.location.href = "../../auth/login/login.html";
}

loadPage();
