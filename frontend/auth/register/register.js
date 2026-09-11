const REGISTER_API =
    "http://localhost:8080/api/auth/register/customer";

const form =
    document.getElementById(
        "registrationForm"
    );

const errorElement =
    document.getElementById(
        "registrationError"
    );

const createButton =
    document.getElementById(
        "createAccountButton"
    );

const createButtonText =
    document.getElementById(
        "createAccountText"
    );


form.addEventListener(
    "submit",
    registerCustomer
);


async function registerCustomer(event) {
    event.preventDefault();

    clearError();

    const firstName =
        value("firstName");

    const middleName =
        value("middleName");

    const lastName =
        value("lastName");

    const email =
        value("email");

    const phoneNumber =
        value("phoneNumber");

    const password =
        document.getElementById(
            "password"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    if (!firstName) {
        return fail(
            "Enter your first name.",
            "firstName"
        );
    }


    if (!lastName) {
        return fail(
            "Enter your last name.",
            "lastName"
        );
    }


    if (!isValidEmail(email)) {
        return fail(
            "Enter a valid email address.",
            "email"
        );
    }


    if (!phoneNumber) {
        return fail(
            "Enter your mobile number.",
            "phoneNumber"
        );
    }


    if (password.length < 8) {
        return fail(
            "Password must contain at least 8 characters.",
            "password"
        );
    }


    if (password !== confirmPassword) {
        return fail(
            "Passwords do not match.",
            "confirmPassword"
        );
    }


    setLoading(true);


    try {
        const response =
            await fetch(
                REGISTER_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            firstName,
                            middleName,
                            lastName,
                            email,
                            phoneNumber,
                            password
                        })
                }
            );


        const data =
            await response
                .json()
                .catch(() => ({}));


        if (!response.ok) {
            throw new Error(
                data.message
                || "Unable to create customer account."
            );
        }


        sessionStorage.setItem(
            "secureFlowRegistrationSuccess",
            "Account created successfully. Sign in using your new customer credentials."
        );


        sessionStorage.setItem(
            "secureFlowRegisteredEmail",
            data.email || email
        );


        window.location.href =
            "../login/login.html";

    } catch (error) {
        showError(
            normalizeError(
                error.message
            )
        );

        setLoading(false);
    }
}


function togglePassword(
    inputId,
    button
) {
    const input =
        document.getElementById(
            inputId
        );

    const hidden =
        input.type === "password";

    input.type =
        hidden
            ? "text"
            : "password";

    button.textContent =
        hidden
            ? "Hide"
            : "Show";
}


function setLoading(loading) {
    createButton.disabled =
        loading;

    createButtonText.textContent =
        loading
            ? "Creating secure account..."
            : "Create Customer Account";
}


function value(id) {
    return document
        .getElementById(id)
        .value
        .trim();
}


function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function fail(
    message,
    inputId
) {
    showError(message);

    document.getElementById(
        inputId
    ).focus();

    return false;
}


function normalizeError(message) {
    const text =
        String(
            message || ""
        );

    if (
        text.toLowerCase()
            .includes(
                "already exists"
            )
    ) {
        return "An account with this email already exists. Please sign in instead.";
    }

    if (
        text.toLowerCase()
            .includes(
                "failed to fetch"
            )
    ) {
        return "Secure Flow registration services are currently unavailable.";
    }

    return text
        || "Unable to create customer account.";
}


function showError(message) {
    errorElement.textContent =
        message;
}


function clearError() {
    errorElement.textContent =
        "";
}
