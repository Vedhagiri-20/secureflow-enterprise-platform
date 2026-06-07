console.log("Employee Dashboard Loaded");

document.addEventListener("DOMContentLoaded", function(){

    const welcomeText = document.getElementById("welcomeText");
    const avatar = document.querySelector(".avatar");

    const savedName =
        localStorage.getItem("secureFlowUserName") ||
        localStorage.getItem("userName") ||
        "Ved";

    welcomeText.innerText = `Hi ${savedName}!`;
    avatar.innerText = savedName.charAt(0).toUpperCase();

});

function quickSearch(){

    const workItemNumber = document.getElementById("workItemSearch").value.trim();
    const loanType = document.getElementById("loanTypeSearch").value;
    const message = document.getElementById("searchMessage");

    message.innerText = "";

    if(workItemNumber === "" && loanType === ""){
        message.innerText = "Enter work item number or select loan type.";
        return;
    }

    const params = new URLSearchParams();

    if(workItemNumber !== ""){
        params.append("workItem", workItemNumber);
    }

    if(loanType !== ""){
        params.append("loanType", loanType);
    }

    window.location.href = `../../report/report.html?${params.toString()}`;
}