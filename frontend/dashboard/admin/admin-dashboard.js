const API =
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


const pageMeta = {

    dashboard: {
        title:
            "Executive Dashboard",

        description:
            "Monitor users, application workflows and security activity."
    },

    users: {
        title:
            "User Management",

        description:
            "Manage identities, roles and SecureFlow access."
    },

    audit: {
        title:
            "Audit & Compliance",

        description:
            "Review authentication and workflow activity."
    },

    settings: {
        title:
            "Security Settings",

        description:
            "Review the current platform security configuration."
    }

};


document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => showPage(
                button.dataset.page
            )
        );

    });


document
    .getElementById(
        "createUserForm"
    )
    .addEventListener(
        "submit",
        createUser
    );


document
    .getElementById(
        "userSearch"
    )
    .addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                loadUsers();
            }

        }
    );


document
    .getElementById(
        "auditSearch"
    )
    .addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                loadAudit();
            }

        }
    );


async function api(
    path,
    options = {}
) {
    const headers = {
        "Authorization":
            `Bearer ${token}`,
        ...(options.headers || {})
    };

    if (options.body) {
        headers["Content-Type"] =
            "application/json";
    }

    const response =
        await fetch(
            `${API}${path}`,
            {
                ...options,
                headers
            }
        );

    if (
        response.status === 401
        || response.status === 403
    ) {
        localStorage.clear();

        goToLogin();

        throw new Error(
            "Administrator session expired"
        );
    }

    const body =
        await response
            .json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            body.message
            || `Request failed (${response.status})`
        );
    }

    return body;
}


function showPage(name) {

    document
        .querySelectorAll(
            ".admin-page"
        )
        .forEach(page => {
            page.classList.remove(
                "active"
            );
        });


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(button => {
            button.classList.remove(
                "active"
            );
        });


    const page =
        document.getElementById(
            `${name}Page`
        );

    if (page) {
        page.classList.add(
            "active"
        );
    }


    const nav =
        document.querySelector(
            `[data-page="${name}"]`
        );

    if (nav) {
        nav.classList.add(
            "active"
        );
    }


    const meta =
        pageMeta[name];

    if (meta) {

        document.getElementById(
            "pageTitle"
        ).textContent =
            meta.title;

        document.getElementById(
            "pageDescription"
        ).textContent =
            meta.description;

    }


    if (name === "users") {
        loadUsers();
    }

    if (name === "audit") {
        loadAudit();
    }


    clearMessage();
}


async function loadDashboard() {

    try {

        const data =
            await api(
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


        renderRecent(
            data.recentActivities || []
        );

    } catch (error) {

        showError(
            error.message
        );

    }
}


function renderRecent(events) {

    const tbody =
        document.getElementById(
            "recentActivityBody"
        );


    if (!events.length) {

        tbody.innerHTML = `
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


    tbody.innerHTML =
        events
            .map(event => `
                <tr>

                    <td>
                        ${escapeHtml(
                            event.actorEmail
                        )}
                    </td>

                    <td>
                        ${rolePill(
                            event.actorRole
                        )}
                    </td>

                    <td>
                        ${formatText(
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
            await api(
                `/users?search=${
                    encodeURIComponent(
                        search
                    )
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

    const tbody =
        document.getElementById(
            "usersBody"
        );


    if (!users.length) {

        tbody.innerHTML = `
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


    tbody.innerHTML =
        users
            .map(user => {

                const active =
                    Boolean(
                        user.active
                    );

                return `
                    <tr>

                        <td>
                            ${escapeHtml(
                                user.fullName
                                || "-"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                user.email
                            )}
                        </td>

                        <td>
                            ${rolePill(
                                user.role
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                user.department
                                || "-"
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
                                            : "disabled"
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

                            <div class="action-row">

                                <button
                                    class="
                                        small-button
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
                                        small-button
                                        ${
                                            active
                                                ? "danger"
                                                : ""
                                        }
                                    "
                                    onclick="
                                        changeAccess(
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
            await api(
                `/users/${userId}`
            );


        setText(
            "viewUserId",
            user.userId
        );

        setText(
            "viewName",
            user.fullName || "-"
        );

        setText(
            "viewEmail",
            user.email
        );

        setText(
            "viewRole",
            user.role
        );

        setText(
            "viewPhone",
            user.phoneNumber || "-"
        );

        setText(
            "viewDepartment",
            user.department || "-"
        );

        setText(
            "viewStatus",
            user.active
                ? "ACTIVE"
                : "DISABLED"
        );

        setText(
            "viewLastLogin",
            formatDate(
                user.lastLoginAt,
                "Not recorded"
            )
        );

        setText(
            "viewCreated",
            formatDate(
                user.createdAt,
                "-"
            )
        );

        setText(
            "viewPassword",
            user.passwordStatus
        );


        document
            .getElementById(
                "userModal"
            )
            .classList.add(
                "show"
            );

    } catch (error) {

        showError(
            error.message
        );

    }
}


async function changeAccess(
    userId,
    active
) {

    const verb =
        active
            ? "enable"
            : "disable";


    if (
        !window.confirm(
            `Are you sure you want to ${verb} this user?`
        )
    ) {
        return;
    }


    try {

        await api(
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


async function loadAudit() {

    try {

        const search =
            document.getElementById(
                "auditSearch"
            ).value.trim();


        const events =
            await api(
                `/audit?search=${
                    encodeURIComponent(
                        search
                    )
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

    const tbody =
        document.getElementById(
            "auditBody"
        );


    if (!events.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty"
                >
                    No matching audit events.
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
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
                        ${rolePill(
                            event.actorRole
                        )}
                    </td>

                    <td>
                        ${formatText(
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


function openCreateUser() {

    document.getElementById(
        "createError"
    ).textContent = "";


    document
        .getElementById(
            "createModal"
        )
        .classList.add(
            "show"
        );
}


function closeCreateUser() {

    document
        .getElementById(
            "createModal"
        )
        .classList.remove(
            "show"
        );
}


function closeUserModal() {

    document
        .getElementById(
            "userModal"
        )
        .classList.remove(
            "show"
        );
}


async function createUser(event) {

    event.preventDefault();


    const error =
        document.getElementById(
            "createError"
        );


    error.textContent = "";


    const payload = {

        fullName:
            document.getElementById(
                "newName"
            ).value.trim(),

        email:
            document.getElementById(
                "newEmail"
            ).value.trim(),

        password:
            document.getElementById(
                "newPassword"
            ).value,

        role:
            document.getElementById(
                "newRole"
            ).value,

        phoneNumber:
            document.getElementById(
                "newPhone"
            ).value.trim(),

        department:
            document.getElementById(
                "newDepartment"
            ).value.trim()

    };


    try {

        await api(
            "/users",
            {
                method: "POST",
                body:
                    JSON.stringify(
                        payload
                    )
            }
        );


        document
            .getElementById(
                "createUserForm"
            )
            .reset();


        closeCreateUser();


        showSuccess(
            "Secure user account created."
        );


        await Promise.all([
            loadUsers(),
            loadDashboard(),
            loadAudit()
        ]);

    } catch (requestError) {

        error.textContent =
            requestError.message;

    }
}


function rolePill(roleName) {

    return `
        <span class="role-pill">
            ${escapeHtml(
                formatText(
                    roleName
                    || "UNKNOWN"
                )
            )}
        </span>
    `;
}


function formatText(value) {

    if (!value) {
        return "-";
    }


    return String(value)
        .replaceAll(
            "_",
            " "
        )
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

    document.getElementById(
        "adminMessage"
    ).textContent = "";
}


function showSuccess(message) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message;


    element.style.color =
        "#23684f";
}


function showError(message) {

    const element =
        document.getElementById(
            "adminMessage"
        );


    element.textContent =
        message || "Request failed.";


    element.style.color =
        "#983d3d";
}


function logout() {

    localStorage.clear();

    goToLogin();
}


function goToLogin() {

    window.location.href =
        "../../auth/login/login.html";
}


async function startAdmin() {

    await Promise.all([
        loadDashboard(),
        loadUsers(),
        loadAudit()
    ]);
}


startAdmin();
