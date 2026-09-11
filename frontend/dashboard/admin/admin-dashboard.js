const API_URL =
    "http://localhost:8080/api/admin";

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

if (!token || role !== "ADMIN") {
    goToLogin();
}

document.getElementById(
    "adminEmail"
).textContent =
    email || "Administrator";


const pageContent = {
    dashboard: {
        title: "Executive Dashboard",
        description:
            "Monitor users, workflow activity and platform security."
    },

    users: {
        title: "User Management",
        description:
            "Manage identities, roles and access to SecureFlow."
    },

    audit: {
        title: "Audit & Compliance",
        description:
            "Review authentication and workflow activity."
    },

    settings: {
        title: "Security Settings",
        description:
            "Review the current platform security configuration."
    }
};


document.querySelectorAll(
    ".nav-item"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {
            showSection(
                button.dataset.section
            );
        }
    );

});


document.getElementById(
    "userSearch"
).addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            loadUsers();
        }

    }
);


document.getElementById(
    "auditSearch"
).addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            loadAudit();
        }

    }
);


document.getElementById(
    "createUserForm"
).addEventListener(
    "submit",
    createUser
);


async function initialLoad() {
    try {
        await Promise.all([
            loadDashboard(),
            loadUsers(),
            loadAudit()
        ]);
    } catch (error) {
        showError(
            error.message
        );
    }
}


function showSection(sectionName) {
    document.querySelectorAll(
        ".admin-section"
    ).forEach(section => {
        section.classList.remove(
            "active"
        );
    });

    document.querySelectorAll(
        ".nav-item"
    ).forEach(button => {
        button.classList.remove(
            "active"
        );
    });

    const target =
        document.getElementById(
            `${sectionName}Section`
        );

    if (target) {
        target.classList.add(
            "active"
        );
    }

    const navButton =
        document.querySelector(
            `[data-section="${sectionName}"]`
        );

    if (navButton) {
        navButton.classList.add(
            "active"
        );
    }

    const content =
        pageContent[sectionName];

    if (content) {
        document.getElementById(
            "pageTitle"
        ).textContent =
            content.title;

        document.getElementById(
            "pageDescription"
        ).textContent =
            content.description;
    }

    clearMessage();
}


async function apiRequest(
    path,
    options = {}
) {
    const headers = {
        "Authorization":
            `Bearer ${token}`,
        ...options.headers
    };

    if (options.body) {
        headers["Content-Type"] =
            "application/json";
    }

    const response =
        await fetch(
            `${API_URL}${path}`,
            {
                ...options,
                headers
            }
        );

    if (response.status === 401
            || response.status === 403) {

        logout();

        throw new Error(
            "Administrator session expired"
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


async function loadDashboard() {
    try {
        const data =
            await apiRequest(
                "/dashboard"
            );

        setText(
            "totalUsers",
            data.totalUsers
        );

        setText(
            "activeUsers",
            data.activeUsers
        );

        setText(
            "totalApplications",
            data.totalApplications
        );

        setText(
            "totalAuditEvents",
            data.totalAuditEvents
        );

        setText(
            "customerCount",
            data.customers
        );

        setText(
            "employeeCount",
            data.employees
        );

        setText(
            "managerCount",
            data.managers
        );

        renderRecentActivity(
            data.recentActivities || []
        );

    } catch (error) {
        showError(
            error.message
        );
    }
}


function renderRecentActivity(events) {
    const body =
        document.getElementById(
            "recentActivityBody"
        );

    if (events.length === 0) {
        body.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="empty"
                >
                    No activity recorded yet.
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML =
        events
            .map(event => `
                <tr>

                    <td>
                        ${escapeHtml(
                            event.actorEmail
                        )}
                    </td>

                    <td>
                        ${roleBadge(
                            event.actorRole
                        )}
                    </td>

                    <td>
                        ${formatAction(
                            event.action
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            event.details || "-"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            event.createdAt
                        )}
                    </td>

                </tr>
            `)
            .join("");
}


async function loadUsers() {
    try {
        const search =
            document.getElementById(
                "userSearch"
            ).value.trim();

        const users =
            await apiRequest(
                `/users?search=${
                    encodeURIComponent(search)
                }`
            );

        renderUsers(users);

    } catch (error) {
        showError(
            error.message
        );
    }
}


function renderUsers(users) {
    const body =
        document.getElementById(
            "usersBody"
        );

    if (users.length === 0) {
        body.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty"
                >
                    No users found.
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML =
        users
            .map(user => {

                const active =
                    Boolean(user.active);

                return `
                    <tr>

                        <td>
                            ${escapeHtml(
                                user.fullName || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                user.email
                            )}
                        </td>

                        <td>
                            ${roleBadge(
                                user.role
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                user.department || "-"
                            )}
                        </td>

                        <td>
                            ${formatDate(
                                user.lastLoginAt,
                                "Not recorded"
                            )}
                        </td>

                        <td>
                            <span
                                class="
                                    status-pill
                                    ${
                                        active
                                            ? "active"
                                            : "inactive"
                                    }
                                "
                            >
                                ${
                                    active
                                        ? "ACTIVE"
                                        : "DISABLED"
                                }
                            </span>
                        </td>

                        <td>

                            <div class="action-group">

                                <button
                                    class="
                                        table-action
                                        gold
                                    "
                                    onclick="
                                        viewUser(
                                            ${user.userId}
                                        )
                                    "
                                >
                                    View
                                </button>

                                <button
                                    class="
                                        table-action
                                        ${
                                            active
                                                ? "danger"
                                                : ""
                                        }
                                    "
                                    onclick="
                                        setUserActive(
                                            ${user.userId},
                                            ${!active}
                                        )
                                    "
                                >
                                    ${
                                        active
                                            ? "Disable"
                                            : "Enable"
                                    }
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            })
            .join("");
}


async function viewUser(userId) {
    try {
        const user =
            await apiRequest(
                `/users/${userId}`
            );

        setText(
            "detailUserId",
            user.userId
        );

        setText(
            "detailName",
            user.fullName || "-"
        );

        setText(
            "detailEmail",
            user.email
        );

        setText(
            "detailRole",
            user.role
        );

        setText(
            "detailPhone",
            user.phoneNumber || "-"
        );

        setText(
            "detailDepartment",
            user.department || "-"
        );

        setText(
            "detailStatus",
            user.active
                ? "ACTIVE"
                : "DISABLED"
        );

        setText(
            "detailLastLogin",
            formatDate(
                user.lastLoginAt,
                "Not recorded yet"
            )
        );

        setText(
            "detailCreated",
            formatDate(
                user.createdAt,
                "-"
            )
        );

        setText(
            "detailPassword",
            user.passwordStatus
        );

        document.getElementById(
            "userDetailsModal"
        ).classList.add(
            "show"
        );

    } catch (error) {
        showError(
            error.message
        );
    }
}


async function setUserActive(
    userId,
    active
) {
    const action =
        active
            ? "enable"
            : "disable";

    const confirmed =
        window.confirm(
            `Are you sure you want to ${action} this user?`
        );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(
            `/users/${userId}/active?active=${active}`,
            {
                method: "PUT"
            }
        );

        showSuccess(
            active
                ? "User access enabled."
                : "User access disabled."
        );

        await Promise.all([
            loadUsers(),
            loadDashboard(),
            loadAudit()
        ]);

    } catch (error) {
        showError(
            error.message
        );
    }
}


function openCreateUserModal() {
    document.getElementById(
        "createUserError"
    ).textContent = "";

    document.getElementById(
        "createUserModal"
    ).classList.add(
        "show"
    );
}


function closeCreateUserModal() {
    document.getElementById(
        "createUserModal"
    ).classList.remove(
        "show"
    );
}


function closeUserDetailsModal() {
    document.getElementById(
        "userDetailsModal"
    ).classList.remove(
        "show"
    );
}


async function createUser(event) {
    event.preventDefault();

    const errorElement =
        document.getElementById(
            "createUserError"
        );

    errorElement.textContent = "";

    const requestBody = {
        fullName:
            document.getElementById(
                "createFullName"
            ).value.trim(),

        email:
            document.getElementById(
                "createEmail"
            ).value.trim(),

        password:
            document.getElementById(
                "createPassword"
            ).value,

        role:
            document.getElementById(
                "createRole"
            ).value,

        phoneNumber:
            document.getElementById(
                "createPhone"
            ).value.trim(),

        department:
            document.getElementById(
                "createDepartment"
            ).value.trim()
    };

    try {
        await apiRequest(
            "/users",
            {
                method: "POST",
                body:
                    JSON.stringify(
                        requestBody
                    )
            }
        );

        document.getElementById(
            "createUserForm"
        ).reset();

        closeCreateUserModal();

        showSuccess(
            "Secure user account created."
        );

        await Promise.all([
            loadUsers(),
            loadDashboard(),
            loadAudit()
        ]);

    } catch (error) {
        errorElement.textContent =
            error.message;
    }
}


async function loadAudit() {
    try {
        const search =
            document.getElementById(
                "auditSearch"
            ).value.trim();

        const events =
            await apiRequest(
                `/audit?search=${
                    encodeURIComponent(search)
                }`
            );

        renderAudit(events);

    } catch (error) {
        showError(
            error.message
        );
    }
}


function renderAudit(events) {
    const body =
        document.getElementById(
            "auditBody"
        );

    if (events.length === 0) {
        body.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty"
                >
                    No matching audit activity.
                </td>
            </tr>
        `;
        return;
    }

    body.innerHTML =
        events
            .map(event => `
                <tr>

                    <td>
                        ${escapeHtml(
                            event.eventId
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            event.actorEmail
                        )}
                    </td>

                    <td>
                        ${roleBadge(
                            event.actorRole
                        )}
                    </td>

                    <td>
                        ${formatAction(
                            event.action
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            event.details || "-"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            event.createdAt
                        )}
                    </td>

                </tr>
            `)
            .join("");
}


function roleBadge(roleName) {
    return `
        <span class="status">
            ${escapeHtml(
                formatAction(
                    roleName || "UNKNOWN"
                )
            )}
        </span>
    `;
}


function formatAction(value) {
    if (!value) {
        return "-";
    }

    return value
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );
}


function formatDate(
    value,
    fallback = "-"
) {
    if (!value) {
        return fallback;
    }

    return new Date(value)
        .toLocaleString();
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
        String(
            value ?? "-"
        );

    return element.innerHTML;
}


function clearMessage() {
    const message =
        document.getElementById(
            "adminMessage"
        );

    message.textContent = "";
}


function showSuccess(text) {
    const message =
        document.getElementById(
            "adminMessage"
        );

    message.textContent = text;

    message.style.color =
        "#23694f";
}


function showError(text) {
    const message =
        document.getElementById(
            "adminMessage"
        );

    message.textContent =
        text || "Request failed.";

    message.style.color =
        "#963f3f";
}


function logout() {
    localStorage.clear();

    goToLogin();
}


function goToLogin() {
    window.location.href =
        "../../auth/login/login.html";
}


initialLoad();
