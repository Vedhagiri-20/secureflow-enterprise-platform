const workflowForm = document.getElementById("workflowForm");

workflowForm.addEventListener("submit", function(event) {

    event.preventDefault();

    alert("Workflow submitted successfully!");

    window.location.href = "../dashboard/dashboard.html";

});

