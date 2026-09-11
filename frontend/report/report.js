const reportToken =
    localStorage.getItem(
        "secureFlowToken"
    );

const reportRole =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const reportName =
    localStorage.getItem(
        "secureFlowUserName"
    ) || "Employee";

const REPORT_API =
    window.secureFlowApiUrl(
        "/api/reports/employee"
    );

let reportData = null;


if (
    !reportToken
    || reportRole !== "EMPLOYEE"
) {
    goToLogin();
}


document.addEventListener(
    "DOMContentLoaded",
    async () => {
        initializeProfile();
        initializeSearch();

        await loadReport();
    }
);


function initializeProfile() {
    const welcome =
        document.getElementById(
            "welcomeText"
        );

    const avatar =
        document.querySelector(
            ".avatar"
        );

    if (welcome) {
        welcome.textContent =
            `Hi ${reportName}!`;
    }

    if (avatar) {
        avatar.textContent =
            reportName
                .charAt(0)
                .toUpperCase();
    }
}


function initializeSearch() {
    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        renderWorkflowTable
    );
}


async function loadReport() {
    try {
        const response =
            await fetch(
                REPORT_API,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${reportToken}`
                    }
                }
            );

        if (
            response.status === 401
            || response.status === 403
        ) {
            logout();

            return;
        }

        const data =
            await response.json()
                .catch(
                    () => ({})
                );

        if (!response.ok) {
            throw new Error(
                data.message
                || "Unable to load report data."
            );
        }

        reportData =
            data;

        loadSummary(
            data
        );

        loadLoanBreakdown(
            data
        );

        renderWorkflowTable();

    } catch (error) {
        console.error(
            "Report error:",
            error
        );

        if (window.SecureFlowLog) {
            window.SecureFlowLog.error(
                "Unable to load employee report",
                error
            );
        }

        showReportError(
            error.message
            || "Unable to load report data."
        );
    }
}


function loadSummary(data) {
    setText(
        "totalWorkflows",
        data.total
    );

    setText(
        "pendingCount",
        data.pending
    );

    setText(
        "approvedCount",
        data.approved
    );

    setText(
        "rejectedCount",
        data.rejected
    );

    setText(
        "pendingCircle",
        data.pending
    );

    setText(
        "approvedCircle",
        data.approved
    );

    setText(
        "rejectedCircle",
        data.rejected
    );

    setText(
        "donutTotal",
        data.total
    );
}


function loadLoanBreakdown(data) {
    const legend =
        document.getElementById(
            "loanLegend"
        );

    const breakdown =
        document.getElementById(
            "loanBreakdown"
        );

    if (
        !legend
        || !breakdown
    ) {
        return;
    }

    const entries =
        Object.entries(
            data.loanBreakdown
            || {}
        );

    if (!entries.length) {
        legend.innerHTML =
            "<li>No assigned applications yet.</li>";

        breakdown.innerHTML =
            '<div class="loan-card"><p>No loan activity available.</p></div>';

        return;
    }

    legend.innerHTML =
        entries
            .map(
                ([loan, count]) =>
                    `<li>${escapeHtml(loan)} - ${count}</li>`
            )
            .join("");

    breakdown.innerHTML =
        entries
            .map(
                ([loan, count]) => `
                    <div class="loan-card">
                        <h4>${escapeHtml(loan)}</h4>
                        <h2>${count}</h2>
                        <p>Assigned Applications</p>
                    </div>
                `
            )
            .join("");
}


function renderWorkflowTable() {
    if (!reportData) {
        return;
    }

    const tbody =
        document.getElementById(
            "reportTableBody"
        );

    if (!tbody) {
        return;
    }

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const query =
        searchInput
            ? searchInput.value
                    .trim()
                    .toLowerCase()
            : "";

    const workflows =
        (
            reportData.workflows
            || []
        ).filter(
            workflow =>
                matchesSearch(
                    workflow,
                    query
                )
        );

    if (!workflows.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    No matching workflow records.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML =
        workflows
            .map(
                workflow => `
                    <tr>
                        <td>${escapeHtml(workflow.workItemNumber)}</td>
                        <td>${escapeHtml(workflow.loanType)}</td>
                        <td>${escapeHtml(workflow.applicantName)}</td>
                        <td>${formatAmount(workflow.loanAmount)}</td>
                        <td>${escapeHtml(formatStatus(workflow.status))}</td>
                        <td>${escapeHtml(workflow.managerName)}</td>
                        <td>${formatDate(workflow.createdDate)}</td>
                    </tr>
                `
            )
            .join("");
}


function matchesSearch(
    workflow,
    query
) {
    if (!query) {
        return true;
    }

    return [
        workflow.workItemNumber,
        workflow.loanType,
        workflow.applicantName,
        workflow.status,
        workflow.managerName
    ]
        .filter(Boolean)
        .some(
            value =>
                String(value)
                    .toLowerCase()
                    .includes(query)
        );
}


function formatAmount(value) {
    return Number(
        value || 0
    ).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    );
}


function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(
        value
    ).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}


function formatStatus(value) {
    return String(
        value || "-"
    )
        .replaceAll(
            "_",
            " "
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
        );
}


function setText(
    id,
    value
) {
    const element =
        document.getElementById(
            id
        );

    if (element) {
        element.textContent =
            value ?? "-";
    }
}


function showReportError(message) {
    const tbody =
        document.getElementById(
            "reportTableBody"
        );

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    ${escapeHtml(message)}
                </td>
            </tr>
        `;
    }
}


function escapeHtml(value) {
    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value == null
            ? "-"
            : String(value);

    return element.innerHTML;
}


function logout() {
    localStorage.clear();
    goToLogin();
}


function goToLogin() {
    if (
        window.location.hostname === "localhost"
        && window.location.port === "5500"
    ) {
        window.location.href =
            "../auth/login/login.html";

        return;
    }

    window.location.href =
        "/login";
}
