function login(){

    const role =
    document.getElementById("role").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const error =
    document.getElementById("error-message");

    error.innerText = "";

    // ROLE VALIDATION

    if(role === ""){

        error.innerText =
        "Please select user role";

        return;
    }

    // EMAIL VALIDATION

    if(email === ""){

        error.innerText =
        "Email is mandatory";

        return;
    }

    // EMAIL FORMAT CHECK

    const emailPattern =
    /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(!email.match(emailPattern)){

        error.innerText =
        "Enter valid email";

        return;
    }

    // PASSWORD VALIDATION

    if(password === ""){

        error.innerText =
        "Password is mandatory";

        return;
    }

    // ROLE BASED REDIRECTION

    if(role === "employee"){

        window.location.href =
        "../../dashboard/employee/employee-dashboard.html";

    }

    else if(role === "manager"){

        window.location.href =
        "../../dashboard/manager/manager-dashboard.html";

    }

    else if(role === "admin"){

        window.location.href =
        "../../dashboard/admin/admin-dashboard.html";

    }

}