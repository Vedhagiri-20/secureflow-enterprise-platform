(function secureFlowRuntime() {
    const CLEAN_ROUTES = {
        "/index.html": "/",
        "/auth/login/login.html": "/login",
        "/auth/register/register.html": "/register",
        "/dashboard/customer/customer-dashboard.html": "/client",
        "/dashboard/employee/employee-dashboard.html": "/employee",
        "/dashboard/manager/manager-dashboard.html": "/manager",
        "/dashboard/admin/admin-dashboard.html": "/admin",
        "/customer/eligibility/eligibility.html": "/eligibility",
        "/workflow/create/create-workflow.html": "/apply",
        "/workflow/details/workflow-details.html": "/application",
        "/report/report.html": "/reports",
        "/notification/notifications.html": "/notifications"
    };

    document.title = "Secure Flow";

    installFavicon();
    installCleanRoute();
    installLogging();

    function installFavicon() {
        let favicon =
            document.querySelector(
                'link[rel~="icon"]'
            );

        if (!favicon) {
            favicon =
                document.createElement(
                    "link"
                );

            favicon.rel =
                "icon";

            document.head.appendChild(
                favicon
            );
        }

        favicon.type =
            "image/svg+xml";

        favicon.href =
            "/assets/favicon.svg";
    }

    function installCleanRoute() {
        if (
            window.location.hostname === "localhost"
            && window.location.port === "5500"
        ) {
            return;
        }

        const cleanPath =
            CLEAN_ROUTES[
                window.location.pathname
            ];

        if (!cleanPath) {
            return;
        }

        const target =
            cleanPath
            + window.location.search
            + window.location.hash;

        window.history.replaceState(
            {},
            "",
            target
        );
    }

    function installLogging() {
        window.SecureFlowLog = {
            info(message) {
                sendLog(
                    "INFO",
                    message,
                    ""
                );
            },

            warn(message) {
                sendLog(
                    "WARN",
                    message,
                    ""
                );
            },

            error(
                message,
                error
            ) {
                sendLog(
                    "ERROR",
                    message,
                    error && error.stack
                        ? error.stack
                        : ""
                );
            }
        };

        window.addEventListener(
            "error",
            event => {
                sendLog(
                    "ERROR",
                    event.message
                        || "Browser error",
                    event.error
                        && event.error.stack
                        ? event.error.stack
                        : ""
                );
            }
        );

        window.addEventListener(
            "unhandledrejection",
            event => {
                const reason =
                    event.reason;

                const message =
                    reason
                    && reason.message
                        ? reason.message
                        : String(
                                reason
                                || "Unhandled promise rejection"
                        );

                const stack =
                    reason
                    && reason.stack
                        ? reason.stack
                        : "";

                sendLog(
                    "ERROR",
                    message,
                    stack
                );
            }
        );

        window.addEventListener(
            "DOMContentLoaded",
            () => {
                sendLog(
                    "INFO",
                    "Page opened",
                    ""
                );
            }
        );
    }

    function sendLog(
        level,
        message,
        stack
    ) {
        const endpoint =
            window.secureFlowApiUrl
                ? window.secureFlowApiUrl(
                        "/api/logs/frontend"
                )
                : "/api/logs/frontend";

        const payload = {
            level:
                String(
                    level || "INFO"
                ).slice(
                    0,
                    20
                ),

            message:
                String(
                    message || "-"
                ).slice(
                    0,
                    1500
                ),

            page:
                window.location.pathname
                    .slice(
                        0,
                        300
                    ),

            stack:
                String(
                    stack || ""
                ).slice(
                    0,
                    3000
                )
        };

        fetch(
            endpoint,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        payload
                    ),

                keepalive: true
            }
        ).catch(
            () => {
                // Logging must never break the application.
            }
        );
    }
})();
