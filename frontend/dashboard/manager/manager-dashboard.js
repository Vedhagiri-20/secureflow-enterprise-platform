const API_URL =
    "http://localhost:8080/api/manager";

const managerEmail =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const managerRole =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

if (!managerEmail
        || managerRole !== "MANAGER"
        || !token) {

    goToLogin();
}

document.getElementById(
    "managerEmail"
).textContent = managerEmail || "";

async function loadPage() {
    clearMessage();

    try {
        await Promise.all([
            loadDashboard(),
            loadApplications()
        ]);
    } catch (error) {
        showError(
            "Unable to load manager data."
        );

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
        "awaitingCount"
    ).textContent =
        data.awaitingApproval;

    document.getElementById(
        "approvedCount"
    ).textContent =
        data.approved;

    document.getElementById(
        "rejectedCount"
    ).textContent =
        data.rejected;
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

    renderApplications(
        applications
    );
}

function renderApplications(
    applications
) {
    const table =
        document.getElementById(
            "applicationTable"
        );

    if (applications.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No applications are
                    waiting for approval.
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
                        application.workItemNumber
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        application.applicantName
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        application.loanType
                    )}
                </td>

                <td>
                    ${formatAmount(
                        application.loanAmount
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        application.employeeName
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        application.priority || "-"
                    )}
                </td>

                <td>
                    <div class="action-group">

                        <button
                            class="action-button approve-button"
                            onclick="approveApplication(
                                ${application.workflowId}
                            )"
                        >
                            Approve
                        </button>

                        <button
                            class="action-button reject-button"
                            onclick="rejectApplication(
                                ${application.workflowId}
                            )"
                        >
                            Reject
                        </button>

                    </div>
                </td>

            </tr>
        `)
        .join("");
}

async function approveApplication(
    workflowId
) {
    const confirmed =
        window.confirm(
            "Approve this loan application?"
        );

    if (!confirmed) {
        return;
    }

    await performDecision(
        workflowId,
        "approve",
        "Application approved successfully."
    );
}

async function rejectApplication(
    workflowId
) {
    const confirmed =
        window.confirm(
            "Reject this loan application?"
        );

    if (!confirmed) {
        return;
    }

    await performDecision(
        workflowId,
        "reject",
        "Application rejected."
    );
}

async function performDecision(
    workflowId,
    action,
    successMessage
) {
    clearMessage();

    try {
        const response = await fetch(
            `${API_URL}/applications/${workflowId}/${action}`,
            {
                method: "PUT",
                headers: authHeaders()
            }
        );

        checkAuthorization(response);

        if (!response.ok) {
            const data =
                await response.json()
                    .catch(() => ({}));

            throw new Error(
                data.message
                    || "Manager action failed"
            );
        }

        showSuccess(
            successMessage
        );

        await loadPage();

    } catch (error) {
        showError(
            error.message
            || "Unable to update application."
        );

        console.error(error);
    }
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

function formatAmount(amount) {
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

function escapeHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        value || "-";

    return element.innerHTML;
}

function clearMessage() {
    const message =
        document.getElementById(
            "message"
        );

    message.textContent = "";
}

function showSuccess(text) {
    const message =
        document.getElementById(
            "message"
        );

    message.textContent = text;
    message.style.color =
        "#45dfbb";
}

function showError(text) {
    const message =
        document.getElementById(
            "message"
        );

    message.textContent = text;
    message.style.color =
        "#ff8585";
}

function logout() {
    localStorage.clear();
    goToLogin();
}

function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}

loadPage();
