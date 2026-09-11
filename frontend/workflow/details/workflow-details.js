const email =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const role =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

const allowedRoles = [
    "CUSTOMER",
    "EMPLOYEE",
    "MANAGER"
];

if (!email
        || !token
        || !allowedRoles.includes(role)) {
    goToLogin();
}

const rolePaths = {
    CUSTOMER: "customer",
    EMPLOYEE: "employee",
    MANAGER: "manager"
};

const dashboardPaths = {
    CUSTOMER:
        "../../dashboard/customer/customer-dashboard.html",

    EMPLOYEE:
        "../../dashboard/employee/employee-dashboard.html",

    MANAGER:
        "../../dashboard/manager/manager-dashboard.html"
};

const API_URL =
    `http://localhost:8080/api/${rolePaths[role]}`;

const backButton =
    document.querySelector(
        ".back-button"
    );

if (backButton) {
    backButton.href =
        dashboardPaths[role];
}

const parameters =
    new URLSearchParams(
        window.location.search
    );

const workflowId =
    parameters.get("id");

if (!workflowId) {
    showError(
        "Application ID is missing."
    );
} else {
    loadPage();
}

async function loadPage() {
    try {
        await Promise.all([
            loadApplication(),
            loadHistory()
        ]);
    } catch (error) {
        showError(
            error.message
            || "Unable to load application details."
        );

        console.error(error);
    }
}

async function loadApplication() {
    const response = await fetch(
        `${API_URL}/applications/${workflowId}`,
        {
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
            || "Application request failed"
        );
    }

    const application =
        await response.json();

    renderApplication(application);
}

async function loadHistory() {
    const response = await fetch(
        `${API_URL}/applications/${workflowId}/history`,
        {
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
            || "History request failed"
        );
    }

    const history =
        await response.json();

    renderHistory(history);
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

        localStorage.clear();
        goToLogin();

        throw new Error(
            "Session expired"
        );
    }
}

function renderApplication(application) {
    setText(
        "workItemNumber",
        application.workItemNumber
    );

    setText(
        "status",
        formatStatus(
            application.status
        )
    );

    setText(
        "loanType",
        application.loanType
    );

    setText(
        "loanAmount",
        formatAmount(
            application.loanAmount
        )
    );

    setText(
        "applicantName",
        application.applicantName
    );

    setText(
        "applicantEmail",
        application.applicantEmail
    );

    setText(
        "applicantPhone",
        application.applicantPhone
    );

    setText(
        "employmentType",
        application.employmentType
    );

    setText(
        "residentialAddress",
        application.residentialAddress
    );

    setText(
        "loanPurpose",
        application.loanPurpose
    );

    setText(
        "priority",
        application.priority
    );

    setText(
        "employeeName",
        application.employeeName
    );

    setText(
        "managerName",
        application.managerName
    );

    setText(
        "submittedAt",
        formatDate(
            application.submittedAt
        )
    );

    updateTracker(
        application.status
    );
}

function renderHistory(history) {
    const container =
        document.getElementById(
            "historyList"
        );

    if (history.length === 0) {
        container.innerHTML =
            '<p class="history-empty">No history available.</p>';

        return;
    }

    container.innerHTML =
        history
            .map(event => `
                <div class="history-item">

                    <div class="history-status">
                        ${formatStatus(
                            event.status
                        )}
                    </div>

                    <div class="history-actor">
                        ${escapeHtml(
                            event.actorRole
                        )}
                        ·
                        ${escapeHtml(
                            event.actorEmail
                        )}
                    </div>

                    <div class="history-date">
                        ${formatDate(
                            event.changedAt
                        )}
                    </div>

                </div>
            `)
            .join("");
}

function updateTracker(status) {
    const submitted =
        document.getElementById(
            "stepSubmitted"
        );

    const review =
        document.getElementById(
            "stepReview"
        );

    const manager =
        document.getElementById(
            "stepManager"
        );

    const decision =
        document.getElementById(
            "stepDecision"
        );

    submitted.classList.add(
        "active"
    );

    if (status === "UNDER_REVIEW"
            || status === "FORWARDED_TO_MANAGER"
            || status === "APPROVED"
            || status === "REJECTED") {

        review.classList.add(
            "active"
        );
    }

    if (status === "FORWARDED_TO_MANAGER"
            || status === "APPROVED") {

        manager.classList.add(
            "active"
        );
    }

    if (status === "APPROVED") {
        decision.classList.add(
            "active"
        );
    }

    if (status === "REJECTED") {
        decision.classList.add(
            "active",
            "rejected"
        );
    }
}

function setText(id, value) {
    document.getElementById(
        id
    ).textContent =
        value || "-";
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

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return new Date(value)
        .toLocaleString();
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
    ).textContent = message;
}

function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}
