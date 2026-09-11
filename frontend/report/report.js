const API_URL =
    "http://localhost:8080/api/reports/employee";

const email = localStorage.getItem("secureFlowUserEmail");
const role = localStorage.getItem("secureFlowUserRole");

let allWorkflows = [];

if (!email || role !== "EMPLOYEE") {
    window.location.href =
        "../auth/login/login.html";
}

document.getElementById("employeeEmail").textContent =
    email || "";

document
    .getElementById("searchInput")
    .addEventListener("input", filterWorkflows);

loadReport();

async function loadReport() {
    try {
        const response = await fetch(
            `${API_URL}?email=${encodeURIComponent(email)}`
        );

        if (!response.ok) {
            throw new Error("Report request failed");
        }

        const data = await response.json();

        document.getElementById("totalWorkflows").textContent =
            data.total;

        document.getElementById("pendingCount").textContent =
            data.pending;

        document.getElementById("approvedCount").textContent =
            data.approved;

        document.getElementById("rejectedCount").textContent =
            data.rejected;

        allWorkflows = data.workflows || [];

        renderLoanBreakdown(data.loanBreakdown || {});
        renderWorkflows(allWorkflows);
    } catch (error) {
        document.getElementById("message").textContent =
            "Unable to load report.";

        console.error(error);
    }
}

function renderLoanBreakdown(breakdown) {
    const container =
        document.getElementById("loanBreakdown");

    const entries = Object.entries(breakdown);

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="loan-card">
                <span>No application data available.</span>
            </div>
        `;

        return;
    }

    container.innerHTML = entries
        .map(([loanType, count]) => `
            <div class="loan-card">
                <span>${escapeHtml(loanType)}</span>
                <strong>${count}</strong>
            </div>
        `)
        .join("");
}

function renderWorkflows(workflows) {
    const table =
        document.getElementById("reportTableBody");

    if (workflows.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No matching applications.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = workflows
        .map(workflow => `
            <tr>
                <td>${escapeHtml(workflow.workItemNumber)}</td>
                <td>${escapeHtml(workflow.loanType)}</td>
                <td>${escapeHtml(workflow.applicantName)}</td>
                <td>${formatAmount(workflow.loanAmount)}</td>
                <td>
                    <span class="status">
                        ${formatStatus(workflow.status)}
                    </span>
                </td>
                <td>${escapeHtml(workflow.managerName)}</td>
                <td>${formatDate(workflow.createdDate)}</td>
            </tr>
        `)
        .join("");
}

function filterWorkflows() {
    const query =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();

    if (!query) {
        renderWorkflows(allWorkflows);
        return;
    }

    const filtered = allWorkflows.filter(workflow =>
        workflow.workItemNumber.toLowerCase().includes(query)
        || workflow.loanType.toLowerCase().includes(query)
        || workflow.applicantName.toLowerCase().includes(query)
        || workflow.status.toLowerCase().includes(query)
    );

    renderWorkflows(filtered);
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

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString();
}

function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = value || "-";
    return element.innerHTML;
}
