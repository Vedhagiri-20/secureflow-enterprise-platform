function login(event){

    event.preventDefault();

    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error-message");

    error.innerText = "";

    if(role === ""){
        error.innerText = "Please select your user role.";
        return;
    }

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

    if(password.length < 6){
        error.innerText = "Password must be at least 6 characters.";
        return;
    }

    if(role === "employee"){
        window.location.href = "../../dashboard/employee/employee-dashboard.html";
    }
    else if(role === "manager"){
        window.location.href = "../../dashboard/manager/manager-dashboard.html";
    }
    else if(role === "admin"){
        window.location.href = "../../dashboard/admin/admin-dashboard.html";
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