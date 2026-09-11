const API =
    window.secureFlowApiUrl('/api/manager');

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

const role =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const email =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const fullName =
    localStorage.getItem(
        "secureFlowUserName"
    ) || email || "SecureFlow Manager";

let pendingApplications = [];
let allApplications = [];


if (!token || role !== "MANAGER") {
    goToLogin();
}


initializeProfile();
initializeNavigation();
initializeSearch();
loadPage();


function initializeProfile() {
    setText(
        "sidebarName",
        fullName
    );

    setText(
        "sidebarEmail",
        email || "-"
    );

    setText(
        "profileName",
        fullName
    );

    setText(
        "profileEmail",
        email || "-"
    );

    setText(
        "profileInitials",
        getInitials(fullName)
    );
}


function initializeNavigation() {
    document.querySelectorAll(
        ".portal-nav-button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => showPage(
                button.dataset.page
            )
        );

    });
}


function initializeSearch() {
    document.getElementById(
        "pendingSearch"
    ).addEventListener(
        "input",
        renderPending
    );

    document.getElementById(
        "historySearch"
    ).addEventListener(
        "input",
        renderHistory
    );
}


function showPage(name) {
    document.querySelectorAll(
        ".portal-view"
    ).forEach(view => {
        view.classList.remove(
            "active"
        );
    });

    document.querySelectorAll(
        ".portal-nav-button"
    ).forEach(button => {
        button.classList.remove(
            "active"
        );
    });

    document.getElementById(
        `${name}Page`
    ).classList.add(
        "active"
    );

    const button =
        document.querySelector(
            `[data-page="${name}"]`
        );

    if (button) {
        button.classList.add(
            "active"
        );
    }

    const meta = {
        dashboard: [
            "Approval Dashboard",
            "Review forwarded loan applications and make final decisions."
        ],

        pending: [
            "Pending Approvals",
            "Search applications currently waiting for your decision."
        ],

        history: [
            "Decision History",
            "Review applications previously approved or rejected."
        ],

        profile: [
            "Manager Profile",
            "Review your authenticated management identity."
        ]
    };

    const selected =
        meta[name];

    setText(
        "pageTitle",
        selected[0]
    );

    setText(
        "pageDescription",
        selected[1]
    );
}


async function loadPage() {
    try {
        const [
            dashboard,
            pending,
            all
        ] = await Promise.all([
            api("/dashboard"),
            api("/applications"),
            api("/applications/all")
        ]);

        pendingApplications =
            pending;

        allApplications =
            all;

        setText(
            "awaitingCount",
            dashboard.awaitingApproval
        );

        setText(
            "approvedCount",
            dashboard.approved
        );

        setText(
            "rejectedCount",
            dashboard.rejected
        );

        renderDashboard();
        renderPending();
        renderHistory();

    } catch (error) {
        showError(
            error.message
        );
    }
}


async function api(
    path,
    options = {}
) {
    const response =
        await fetch(
            `${API}${path}`,
            {
                ...options,

                headers: {
                    "Authorization":
                        `Bearer ${token}`,
                    ...(options.headers || {})
                }
            }
        );

    if (
        response.status === 401
        || response.status === 403
    ) {
        logout();

        throw new Error(
            "Session expired"
        );
    }

    const data =
        await response.json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message
            || "Request failed"
        );
    }

    return data;
}


function renderDashboard() {
    renderApplications(
        document.getElementById(
            "dashboardPendingTable"
        ),
        pendingApplications.slice(
            0,
            5
        ),
        true,
        false
    );
}


function renderPending() {
    const query =
        document.getElementById(
            "pendingSearch"
        ).value.trim()
            .toLowerCase();

    const filtered =
        pendingApplications
            .filter(application =>
                matchesSearch(
                    application,
                    query
                )
            );

    const target =
        document.getElementById(
            "pendingTable"
        );

    if (!filtered.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="portal-empty"
                >
                    No matching applications are waiting for approval.
                </td>
            </tr>
        `;

        return;
    }

    target.innerHTML =
        filtered.map(
            application => `
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
                        ${decisionActions(
                            application.workflowId
                        )}
                    </td>

                </tr>
            `
        ).join("");
}


function renderHistory() {
    const query =
        document.getElementById(
            "historySearch"
        ).value.trim()
            .toLowerCase();

    const completed =
        allApplications
            .filter(application =>
                [
                    "APPROVED",
                    "REJECTED"
                ].includes(
                    application.status
                )
            )
            .filter(application =>
                matchesSearch(
                    application,
                    query
                )
            );

    const target =
        document.getElementById(
            "historyTable"
        );

    if (!completed.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="portal-empty"
                >
                    No completed manager decisions found.
                </td>
            </tr>
        `;

        return;
    }

    target.innerHTML =
        completed.map(
            application => `
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
                        <span
                            class="
                                portal-status
                                ${
                                    statusClass(
                                        application.status
                                    )
                                }
                            "
                        >
                            ${formatStatus(
                                application.status
                            )}
                        </span>
                    </td>

                    <td>
                        <button
                            class="
                                portal-action
                                view
                            "
                            onclick="
                                viewApplication(
                                    ${application.workflowId}
                                )
                            "
                        >
                            View
                        </button>
                    </td>

                </tr>
            `
        ).join("");
}


function renderApplications(
    target,
    items,
    actions,
    showStatus
) {
    if (!items.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="portal-empty"
                >
                    No applications are waiting for approval.
                </td>
            </tr>
        `;

        return;
    }

    target.innerHTML =
        items.map(
            application => `
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
                        ${
                            actions
                                ? decisionActions(
                                    application.workflowId
                                )
                                : showStatus
                                    ? formatStatus(
                                        application.status
                                    )
                                    : "-"
                        }
                    </td>

                </tr>
            `
        ).join("");
}


function decisionActions(
    workflowId
) {
    return `
        <div class="portal-actions">

            <button
                class="
                    portal-action
                    view
                "
                onclick="
                    viewApplication(
                        ${workflowId}
                    )
                "
            >
                View
            </button>

            <button
                class="
                    portal-action
                    approve
                "
                onclick="
                    approveApplication(
                        ${workflowId}
                    )
                "
            >
                Approve
            </button>

            <button
                class="
                    portal-action
                    reject
                "
                onclick="
                    rejectApplication(
                        ${workflowId}
                    )
                "
            >
                Reject
            </button>

        </div>
    `;
}


function matchesSearch(
    application,
    query
) {
    if (!query) {
        return true;
    }

    return [
        application.workItemNumber,
        application.applicantName,
        application.applicantEmail,
        application.loanType,
        application.employeeName,
        application.priority,
        application.status
    ]
        .filter(Boolean)
        .some(value =>
            String(value)
                .toLowerCase()
                .includes(query)
        );
}


function viewApplication(
    workflowId
) {
    window.location.href =
        `../../workflow/details/workflow-details.html?id=${workflowId}`;
}


async function approveApplication(
    workflowId
) {
    if (
        !window.confirm(
            "Approve this loan application?"
        )
    ) {
        return;
    }

    await decide(
        workflowId,
        "approve",
        "Application approved."
    );
}


async function rejectApplication(
    workflowId
) {
    if (
        !window.confirm(
            "Reject this loan application?"
        )
    ) {
        return;
    }

    await decide(
        workflowId,
        "reject",
        "Application rejected."
    );
}


async function decide(
    workflowId,
    action,
    successMessage
) {
    try {
        await api(
            `/applications/${workflowId}/${action}`,
            {
                method: "PUT"
            }
        );

        await loadPage();

        showSuccess(
            successMessage
        );

    } catch (error) {
        showError(
            error.message
        );
    }
}


function statusClass(status) {
    if (status === "APPROVED") {
        return "approved";
    }

    if (status === "REJECTED") {
        return "rejected";
    }

    return "review";
}


function formatStatus(value) {
    return String(
        value || "-"
    )
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            character =>
                character.toUpperCase()
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


function getInitials(value) {
    return String(
        value || "SF"
    )
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part =>
            part.charAt(0)
                .toUpperCase()
        )
        .join("")
        || "SF";
}


function setText(
    id,
    value
) {
    document.getElementById(
        id
    ).textContent =
        value ?? "-";
}


function escapeHtml(value) {
    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value || "-";

    return element.innerHTML;
}


function showSuccess(message) {
    const element =
        document.getElementById(
            "message"
        );

    element.textContent =
        message;

    element.style.color =
        "#236b53";
}


function showError(message) {
    const element =
        document.getElementById(
            "message"
        );

    element.textContent =
        message;

    element.style.color =
        "#974646";
}


function logout() {
    localStorage.clear();
    goToLogin();
}


function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}
