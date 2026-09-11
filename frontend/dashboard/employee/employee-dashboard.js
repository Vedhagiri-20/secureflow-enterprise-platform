const API =
    "http://localhost:8080/api/employee";

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
    ) || email || "SecureFlow Employee";

let availableApplications = [];
let assignedApplications = [];


if (!token || role !== "EMPLOYEE") {
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
        "availableSearch"
    ).addEventListener(
        "input",
        renderAvailable
    );

    document.getElementById(
        "reviewSearch"
    ).addEventListener(
        "input",
        renderAssigned
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
            "Lending Dashboard",
            "Review and process SecureFlow customer applications."
        ],

        available: [
            "Available Applications",
            "Search new applications waiting for an employee."
        ],

        reviews: [
            "My Reviews",
            "Search applications currently or previously handled by you."
        ],

        profile: [
            "Employee Profile",
            "Review your authenticated employee identity."
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
            available,
            assigned
        ] = await Promise.all([
            api("/dashboard"),
            api("/applications/available"),
            api("/applications")
        ]);

        availableApplications =
            available;

        assignedApplications =
            assigned;

        setText(
            "availableCount",
            dashboard.available
        );

        setText(
            "assignedCount",
            dashboard.assigned
        );

        setText(
            "reviewCount",
            dashboard.underReview
        );

        setText(
            "forwardedCount",
            dashboard.forwarded
        );

        setText(
            "rejectedCount",
            dashboard.rejected
        );

        renderAvailable();
        renderAssigned();
        renderRecent();

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


function renderRecent() {
    renderApplications(
        document.getElementById(
            "recentAssignedTable"
        ),
        assignedApplications.slice(
            0,
            5
        ),
        true
    );
}


function renderAvailable() {
    const query =
        document.getElementById(
            "availableSearch"
        ).value.trim()
            .toLowerCase();

    const filtered =
        availableApplications
            .filter(application =>
                matchesSearch(
                    application,
                    query
                )
            );

    const target =
        document.getElementById(
            "availableTable"
        );

    if (!filtered.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="portal-empty"
                >
                    No matching available applications.
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
                            application.priority || "-"
                        )}
                    </td>

                    <td>

                        <div class="portal-actions">

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

                            <button
                                class="
                                    portal-action
                                    gold
                                "
                                onclick="
                                    startReview(
                                        ${application.workflowId}
                                    )
                                "
                            >
                                Start Review
                            </button>

                        </div>

                    </td>

                </tr>
            `
        ).join("");
}


function renderAssigned() {
    const query =
        document.getElementById(
            "reviewSearch"
        ).value.trim()
            .toLowerCase();

    const filtered =
        assignedApplications
            .filter(application =>
                matchesSearch(
                    application,
                    query
                )
            );

    renderApplications(
        document.getElementById(
            "assignedTable"
        ),
        filtered,
        true
    );
}


function renderApplications(
    target,
    items,
    includeActions
) {
    if (!items.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="portal-empty"
                >
                    No matching applications.
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
                        ${
                            includeActions
                                ? renderActions(
                                    application
                                )
                                : "-"
                        }
                    </td>

                </tr>
            `
        ).join("");
}


function renderActions(
    application
) {
    let html = `
        <div class="portal-actions">

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
    `;

    if (
        application.status
        === "UNDER_REVIEW"
    ) {
        html += `
            <button
                class="
                    portal-action
                    gold
                "
                onclick="
                    forwardApplication(
                        ${application.workflowId}
                    )
                "
            >
                Forward
            </button>

            <button
                class="
                    portal-action
                    reject
                "
                onclick="
                    rejectApplication(
                        ${application.workflowId}
                    )
                "
            >
                Reject
            </button>
        `;
    }

    html += "</div>";

    return html;
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
        application.status,
        application.priority
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


async function startReview(
    workflowId
) {
    await performAction(
        workflowId,
        "review",
        "Application assigned to you."
    );

    showPage(
        "reviews"
    );
}


async function forwardApplication(
    workflowId
) {
    if (
        !window.confirm(
            "Forward this application to the manager?"
        )
    ) {
        return;
    }

    await performAction(
        workflowId,
        "forward",
        "Application forwarded to manager."
    );
}


async function rejectApplication(
    workflowId
) {
    if (
        !window.confirm(
            "Reject this application?"
        )
    ) {
        return;
    }

    await performAction(
        workflowId,
        "reject",
        "Application rejected."
    );
}


async function performAction(
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

    if (
        status === "UNDER_REVIEW"
        || status === "FORWARDED_TO_MANAGER"
    ) {
        return "review";
    }

    return "";
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
