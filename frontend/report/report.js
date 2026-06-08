document.addEventListener("DOMContentLoaded", async () => {

    const savedName =
        localStorage.getItem("secureFlowUserName") ||
        "Ved";

    const savedEmail =
        localStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    document.getElementById("welcomeText").innerText =
        `Hi ${savedName}!`;

    document.querySelector(".avatar").innerText =
        savedName.charAt(0).toUpperCase();

    await loadReport(savedEmail);
});

async function loadReport(email) {

    try {

        const response = await fetch(
            `http://localhost:8080/api/reports/employee?email=${email}`
        );

        const data = await response.json();

        loadSummary(data);

        loadLoanBreakdown(data);

        loadWorkflowTable(data);

    }
    catch(error){

        console.error(error);

        alert("Unable to load report data.");
    }
}

function loadSummary(data){

    document.getElementById("totalWorkflows").innerText =
        data.total;

    document.getElementById("pendingCount").innerText =
        data.pending;

    document.getElementById("approvedCount").innerText =
        data.approved;

    document.getElementById("rejectedCount").innerText =
        data.rejected;

    document.getElementById("pendingCircle").innerText =
        data.pending;

    document.getElementById("approvedCircle").innerText =
        data.approved;

    document.getElementById("rejectedCircle").innerText =
        data.rejected;

    document.getElementById("donutTotal").innerText =
        data.total;
}

function loadLoanBreakdown(data){

    const legend =
        document.getElementById("loanLegend");

    const breakdown =
        document.getElementById("loanBreakdown");

    legend.innerHTML = "";
    breakdown.innerHTML = "";

    Object.entries(data.loanBreakdown)
        .forEach(([loan,count]) => {

            legend.innerHTML += `
                <li>${loan} - ${count}</li>
            `;

            breakdown.innerHTML += `
                <div class="loan-card">
                    <h4>${loan}</h4>
                    <h2>${count}</h2>
                    <p>Total Workflows</p>
                </div>
            `;
        });
}

function loadWorkflowTable(data){

    const tbody =
        document.getElementById("reportTableBody");

    tbody.innerHTML = "";

    data.workflows.forEach(workflow => {

        tbody.innerHTML += `
            <tr>
                <td>${workflow.workItemNumber}</td>
                <td>${workflow.loanType}</td>
                <td>${workflow.applicantName}</td>
                <td>$${Number(workflow.loanAmount).toLocaleString()}</td>
                <td>${workflow.status}</td>
                <td>${workflow.managerName}</td>
                <td>${formatDate(workflow.createdDate)}</td>
            </tr>
        `;
    });
}

function formatDate(dateString){

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-US",
        {
            year:"numeric",
            month:"short",
            day:"numeric"
        }
    );
}