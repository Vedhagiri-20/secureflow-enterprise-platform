function checkAuthentication(requiredRole) {

    const isLoggedIn =
        sessionStorage.getItem("isLoggedIn");

    const currentRole =
        sessionStorage.getItem("secureFlowUserRole");

    if (!isLoggedIn) {

        alert("Session expired. Please login.");

        window.location.href =
            "../../auth/login/login.html";

        return false;
    }

    if (requiredRole && currentRole !== requiredRole) {

        alert(
            "Access Denied. You do not have permission to access this page."
        );

        logout();
        return false;
    }

    return true;
}

function logout() {

    sessionStorage.clear();

    window.location.href =
        "../../auth/login/login.html";
}