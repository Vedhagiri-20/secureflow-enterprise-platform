async function login(event) {
    event.preventDefault();

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const password =
        document.getElementById(
            "password"
        ).value;

    const errorMessage =
        document.getElementById(
            "error-message"
        );

    errorMessage.textContent = "";

    if (!email || !password) {
        errorMessage.textContent =
            "Email and password are required.";

        return;
    }

    try {
        const response =
            await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            email,
                            password
                        })
                }
            );

        const data =
            await response.json();

        if (data.message !== "Login Successful"
                || !data.token) {

            errorMessage.textContent =
                data.message
                || "Login failed.";

            return;
        }

        localStorage.setItem(
            "secureFlowUserEmail",
            data.email || email
        );

        localStorage.setItem(
            "secureFlowUserName",
            data.fullName
                || data.email
                || email
        );

        localStorage.setItem(
            "secureFlowUserRole",
            data.role
        );

        localStorage.setItem(
            "secureFlowToken",
            data.token
        );

        const destinations = {
            CUSTOMER:
                "../../dashboard/customer/customer-dashboard.html",

            EMPLOYEE:
                "../../dashboard/employee/employee-dashboard.html",

            MANAGER:
                "../../dashboard/manager/manager-dashboard.html",

            ADMIN:
                "../../dashboard/admin/admin-dashboard.html"
        };

        const destination =
            destinations[data.role];

        if (!destination) {
            errorMessage.textContent =
                "Unknown user role.";

            return;
        }

        window.location.href =
            destination;

    } catch (error) {
        errorMessage.textContent =
            "Unable to connect to SecureFlow.";

        console.error(error);
    }
}


function togglePassword() {
    const password =
        document.getElementById(
            "password"
        );

    const button =
        document.querySelector(
            ".toggle-btn"
        );

    const hidden =
        password.type === "password";

    password.type =
        hidden
            ? "text"
            : "password";

    if (button) {
        button.textContent =
            hidden
                ? "Hide"
                : "Show";
    }
}
