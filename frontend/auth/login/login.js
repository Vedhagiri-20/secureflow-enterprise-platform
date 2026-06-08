async function login(event){

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error-message");

    error.innerText = "";

    if(email === ""){
        error.innerText = "Email address is mandatory.";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if(!emailPattern.test(email)){
        error.innerText = "Please enter a valid email address.";
        return;
    }

    if(password === ""){
        error.innerText = "Password is mandatory.";
        return;
    }

    try{

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if(data.message !== "Login Successful"){
            error.innerText = data.message;
            return;
        }

        localStorage.setItem("secureFlowUserEmail", email);
        localStorage.setItem("secureFlowUserRole", data.role);

        if(data.role === "EMPLOYEE"){
            window.location.href = "../../dashboard/employee/employee-dashboard.html";
        }
        else if(data.role === "MANAGER"){
            window.location.href = "../../dashboard/manager/manager-dashboard.html";
        }
        else if(data.role === "ADMIN"){
            window.location.href = "../../dashboard/admin/admin-dashboard.html";
        }
        else{
            error.innerText = "Unknown user role.";
        }

    }
    catch(errorObj){
        error.innerText = "Backend server is not running. Please start Spring Boot.";
        console.error(errorObj);
    }
}

function togglePassword(){

    const password = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-btn");

    if(password.type === "password"){
        password.type = "text";
        toggleBtn.innerText = "Hide";
    }
    else{
        password.type = "password";
        toggleBtn.innerText = "Show";
    }
}