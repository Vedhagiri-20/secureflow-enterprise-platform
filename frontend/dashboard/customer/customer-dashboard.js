const API =
    "http://localhost:8080/api/customer";

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
    ) || email || "SecureFlow Client";

let applications = [];


if (!token || role !== "CUSTOMER") {
    goToLogin();
}


initializeProfile();
initializeNavigation();
loadPage();


function initializeProfile() {
    document.getElementById(
        "sidebarName"
    ).textContent =
        fullName;

    document.getElementById(
        "sidebarEmail"
    ).textContent =
        email || "-";

    document.getElementById(
        "profileName"
    ).textContent =
        fullName;

    document.getElementById(
        "profileEmail"
    ).textContent =
        email || "-";

    document.getElementById(
        "profileInitials"
    ).textContent =
        getInitials(fullName);
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
            "Client Dashboard",
            "Review your loan portfolio and application progress."
        ],

        current: [
            "Current Applications",
            "Monitor applications moving through SecureFlow review."
        ],

        completed: [
            "Completed Applications",
            "Review your final approved and rejected decisions."
        ],

        profile: [
            "Account Profile",
            "Review your authenticated SecureFlow identity."
        ]
    };

    const selected =
        meta[name];

    document.getElementById(
        "pageTitle"
    ).textContent =
        selected[0];

    document.getElementById(
        "pageDescription"
    ).textContent =
        selected[1];
}


async function loadPage() {
    try {
        const [
            dashboard,
            applicationData
        ] = await Promise.all([
            api("/dashboard"),
            api("/applications")
        ]);

        applications =
            applicationData;

        document.getElementById(
            "totalCount"
        ).textContent =
            dashboard.total;

        document.getElementById(
            "submittedCount"
        ).textContent =
            dashboard.submitted;

        document.getElementById(
            "reviewCount"
        ).textContent =
            dashboard.underReview
            + dashboard.forwarded;

        document.getElementById(
            "approvedCount"
        ).textContent =
            dashboard.approved;

        document.getElementById(
            "rejectedCount"
        ).textContent =
            dashboard.rejected;

        renderTables();

    } catch (error) {
        showError(
            error.message
        );
    }
}


async function api(path) {
    const response =
        await fetch(
            `${API}${path}`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
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


function renderTables() {
    renderApplications(
        document.getElementById(
            "recentTable"
        ),
        applications.slice(
            0,
            5
        )
    );

    renderApplications(
        document.getElementById(
            "currentTable"
        ),
        applications.filter(
            application =>
                [
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "FORWARDED_TO_MANAGER"
                ].includes(
                    application.status
                )
        )
    );

    renderApplications(
        document.getElementById(
            "completedTable"
        ),
        applications.filter(
            application =>
                [
                    "APPROVED",
                    "REJECTED"
                ].includes(
                    application.status
                )
        )
    );
}


function renderApplications(
    target,
    items
) {
    if (!items.length) {
        target.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="portal-empty"
                >
                    No applications in this section.
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
                        ${formatDate(
                            application.submittedAt
                        )}
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


function viewApplication(
    workflowId
) {
    window.location.href =
        `../../workflow/details/workflow-details.html?id=${workflowId}`;
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


function formatStatus(status) {
    return String(
        status || "-"
    )
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            value =>
                value.toUpperCase()
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

    return new Date(value)
        .toLocaleString();
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


function escapeHtml(value) {
    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value || "-";

    return element.innerHTML;
}


function showError(message) {
    document.getElementById(
        "message"
    ).textContent =
        message;
}


function logout() {
    localStorage.clear();
    goToLogin();
}


function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}
