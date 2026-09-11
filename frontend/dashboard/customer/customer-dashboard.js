const API_URL =
    "http://localhost:8080/api/customer";

const customerEmail =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const customerRole =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

if (!customerEmail
        || customerRole !== "CUSTOMER"
        || !token) {

    goToLogin();
}

document.getElementById(
    "customerEmail"
).textContent = customerEmail || "";

async function loadPage() {
    document.getElementById(
        "message"
    ).textContent = "";

    try {
        await Promise.all([
            loadDashboard(),
            loadApplications()
        ]);
    } catch (error) {
        document.getElementById(
            "message"
        ).textContent =
            "Unable to load customer data.";

        console.error(error);
    }
}

async function loadDashboard() {
    const response = await fetch(
        `${API_URL}/dashboard`,
        {
            headers: authHeaders()
        }
    );

    checkAuthorization(response);

    if (!response.ok) {
        throw new Error(
            "Dashboard request failed"
        );
    }

    const data =
        await response.json();

    document.getElementById(
        "totalCount"
    ).textContent = data.total;

    document.getElementById(
        "submittedCount"
    ).textContent = data.submitted;

    document.getElementById(
        "reviewCount"
    ).textContent =
        data.underReview + data.forwarded;

    document.getElementById(
        "approvedCount"
    ).textContent = data.approved;

    document.getElementById(
        "rejectedCount"
    ).textContent = data.rejected;
}

async function loadApplications() {
    const response = await fetch(
        `${API_URL}/applications`,
        {
            headers: authHeaders()
        }
    );

    checkAuthorization(response);

    if (!response.ok) {
        throw new Error(
            "Applications request failed"
        );
    }

    const applications =
        await response.json();

    renderApplications(applications);
}

function renderApplications(applications) {
    const table =
        document.getElementById(
            "applicationTable"
        );

    if (applications.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No applications yet.
                </td>
            </tr>
        `;
        return;
    }

    table.innerHTML = applications
        .map(application => `
            <tr>
                <td>
                    ${escapeHtml(
                        application.workItemNumber || "-"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        application.loanType || "-"
                    )}
                </td>

                <td>
                    ${formatAmount(
                        application.loanAmount
                    )}
                </td>

                <td>
                    <span class="status ${
                        statusClass(
                            application.status
                        )
                    }">
                        ${formatStatus(
                            application.status
                        )}
                    </span>
                </td>

                <td>
                    ${formatDate(
                        application.submittedAt
                    )}
                </td>

                <td>
                    <button
                        type="button"
                        class="refresh-button"
                        onclick="viewApplication(
                            ${application.workflowId}
                        )"
                    >
                        View
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

function authHeaders() {
    return {
        "Authorization":
            `Bearer ${token}`
    };
}

function checkAuthorization(response) {
    if (response.status === 401
            || response.status === 403) {

        logout();
        throw new Error(
            "Session expired"
        );
    }
}

function viewApplication(workflowId) {
    window.location.href =
        `../../workflow/details/workflow-details.html?id=${workflowId}`;
}

function formatAmount(amount) {
    if (amount === null
            || amount === undefined) {
        return "-";
    }

    return Number(amount)
        .toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
            }
        );
}

function formatStatus(status) {
    if (!status) {
        return "-";
    }

    return status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            letter => letter.toUpperCase()
        );
}

function statusClass(status) {
    if (status === "APPROVED") {
        return "approved";
    }

    if (status === "REJECTED") {
        return "rejected";
    }

    if (status === "UNDER_REVIEW"
            || status === "FORWARDED_TO_MANAGER") {
        return "review";
    }

    return "";
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value)
        .toLocaleString();
}

function escapeHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        value || "-";

    return element.innerHTML;
}

function logout() {
    localStorage.removeItem(
        "secureFlowUserEmail"
    );

    localStorage.removeItem(
        "secureFlowUserRole"
    );

    localStorage.removeItem(
        "secureFlowToken"
    );

    goToLogin();
}

function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}

loadPage();
