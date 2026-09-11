async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    if (!email) {
        errorMessage.textContent = "Email address is mandatory.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent =
            "Please enter a valid email address.";
        return;
    }

    if (!password) {
        errorMessage.textContent = "Password is mandatory.";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (data.message !== "Login Successful") {
            errorMessage.textContent =
                data.message || "Login failed.";
            return;
        }

        localStorage.setItem("secureFlowUserEmail", email);
        localStorage.setItem("secureFlowUserRole", data.role);

        if (data.role === "CUSTOMER") {
            window.location.href =
                "../../dashboard/customer/customer-dashboard.html";
            return;
        }

        if (data.role === "EMPLOYEE") {
            window.location.href =
                "../../dashboard/employee/employee-dashboard.html";
            return;
        }

        if (data.role === "MANAGER") {
            window.location.href =
                "../../dashboard/manager/manager-dashboard.html";
            return;
        }

        if (data.role === "ADMIN") {
            window.location.href =
                "../../dashboard/admin/admin-dashboard.html";
            return;
        }

        errorMessage.textContent = "Unknown user role.";
    } catch (error) {
        errorMessage.textContent =
            "Backend server is not running. Please start Spring Boot.";

        console.error(error);
    }
}

function togglePassword() {
    const password = document.getElementById("password");
    const toggleButton = document.querySelector(".toggle-btn");

    if (password.type === "password") {
        password.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        password.type = "password";
        toggleButton.textContent = "Show";
    }
}
