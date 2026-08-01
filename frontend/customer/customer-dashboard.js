document.addEventListener("DOMContentLoaded", () => {

    checkAuthentication("CUSTOMER");

    const customerName =
        sessionStorage.getItem("secureFlowUserName") ||
        getNameFromEmail(sessionStorage.getItem("secureFlowUserEmail")) ||
        "Customer";

    document.getElementById("welcomeText").innerText = `Hi ${customerName}!`;
    document.querySelector(".avatar").innerText =
        customerName.charAt(0).toUpperCase();
});

function getNameFromEmail(email) {
    if (!email || !email.includes("@")) {
        return "Customer";
    }

    return email.split("@")[0].split(/[._-]/)[0];
}