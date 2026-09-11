const LOGIN_API =
    "http://localhost:8080/api/auth/login";

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const errorMessage =
    document.getElementById(
        "error-message"
    );

const successMessage =
    document.getElementById(
        "success-message"
    );

const loginButton =
    document.getElementById(
        "loginButton"
    );

const loginButtonText =
    document.getElementById(
        "loginButtonText"
    );

const rememberMe =
    document.getElementById(
        "rememberMe"
    );


restoreRememberedEmail();
showRegistrationSuccess();


async function login(event) {
    event.preventDefault();

    clearError();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email) {
        showError(
            "Enter your registered email address."
        );

        emailInput.focus();

        return;
    }

    if (!isValidEmail(email)) {
        showError(
            "Enter a valid email address."
        );

        emailInput.focus();

        return;
    }

    if (!password) {
        showError(
            "Enter your Secure Flow password."
        );

        passwordInput.focus();

        return;
    }

    setLoading(true);

    try {
        const response =
            await fetch(
                LOGIN_API,
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
            await response
                .json()
                .catch(() => ({}));

        if (!response.ok
                || data.message
                    !== "Login Successful"
                || !data.token) {

            throw new Error(
                data.message
                || "Secure authentication failed."
            );
        }

        handleRememberedEmail(
            email
        );

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

        const destination =
            getDestination(
                data.role
            );

        if (!destination) {
            throw new Error(
                "Your Secure Flow role is not configured for portal access."
            );
        }

        loginButtonText.textContent =
            "Access granted";

        window.setTimeout(
            () => {
                window.location.href =
                    destination;
            },
            220
        );

    } catch (error) {
        showError(
            normalizeError(
                error.message
            )
        );

        setLoading(false);
    }
}


function togglePassword() {
    const showPassword =
        passwordInput.type
        === "password";

    passwordInput.type =
        showPassword
            ? "text"
            : "password";

    const toggle =
        document.querySelector(
            ".toggle-btn"
        );

    toggle.textContent =
        showPassword
            ? "Hide"
            : "Show";

    toggle.setAttribute(
        "aria-label",
        showPassword
            ? "Hide password"
            : "Show password"
    );
}


function setLoading(loading) {
    loginButton.disabled =
        loading;

    emailInput.disabled =
        loading;

    passwordInput.disabled =
        loading;

    loginButtonText.textContent =
        loading
            ? "Verifying secure access..."
            : "Sign in securely";
}


function getDestination(role) {
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

    return destinations[role];
}


function handleRememberedEmail(email) {
    if (rememberMe.checked) {
        localStorage.setItem(
            "secureFlowRememberedEmail",
            email
        );

        return;
    }

    localStorage.removeItem(
        "secureFlowRememberedEmail"
    );
}


function restoreRememberedEmail() {
    const remembered =
        localStorage.getItem(
            "secureFlowRememberedEmail"
        );

    if (!remembered) {
        return;
    }

    emailInput.value =
        remembered;

    rememberMe.checked =
        true;
}


function showRegistrationSuccess() {
    const message =
        sessionStorage.getItem(
            "secureFlowRegistrationSuccess"
        );

    const registeredEmail =
        sessionStorage.getItem(
            "secureFlowRegisteredEmail"
        );

    if (!message) {
        return;
    }

    successMessage.textContent =
        message;

    successMessage.classList.add(
        "show"
    );

    if (registeredEmail) {
        emailInput.value =
            registeredEmail;

        passwordInput.focus();
    }

    sessionStorage.removeItem(
        "secureFlowRegistrationSuccess"
    );

    sessionStorage.removeItem(
        "secureFlowRegisteredEmail"
    );
}


function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(value);
}


function normalizeError(message) {
    const lowerMessage =
        String(
            message || ""
        ).toLowerCase();

    if (lowerMessage.includes(
        "invalid email"
    )) {
        return "We could not verify this email address.";
    }

    if (lowerMessage.includes(
        "invalid password"
    )) {
        return "The password entered is incorrect.";
    }

    if (lowerMessage.includes(
        "inactive"
    )) {
        return "This account is currently disabled.";
    }

    if (lowerMessage.includes(
        "failed to fetch"
    )) {
        return "Secure Flow authentication services are currently unavailable.";
    }

    return message
        || "Secure authentication failed.";
}


function showError(message) {
    errorMessage.textContent =
        message;
}


function clearError() {
    errorMessage.textContent =
        "";
}
