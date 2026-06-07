const defaultReports = [
    {
        workItemNumber: "HL-0001",
        loanType: "Home Loan",
        applicantName: "Ved",
        loanAmount: "250000",
        status: "Pending",
        assignedManager: "Home Loan Manager",
        createdDate: "2026-06-07"
    },
    {
        workItemNumber: "CL-0002",
        loanType: "Car Loan",
        applicantName: "Rahul Sharma",
        loanAmount: "45000",
        status: "Approved",
        assignedManager: "Auto Loan Manager",
        createdDate: "2026-06-06"
    },
    {
        workItemNumber: "EL-0003",
        loanType: "Education Loan",
        applicantName: "Priya Mehta",
        loanAmount: "80000",
        status: "Rejected",
        assignedManager: "Education Loan Manager",
        createdDate: "2026-06-05"
    },
    {
        workItemNumber: "BL-0004",
        loanType: "Business Loan",
        applicantName: "Arjun Patel",
        loanAmount: "500000",
        status: "Pending",
        assignedManager: "Business Banking Manager",
        createdDate: "2026-06-04"
    },
    {
        workItemNumber: "HL-0005",
        loanType: "Housing Loan",
        applicantName: "Sneha Reddy",
        loanAmount: "320000",
        status: "Approved",
        assignedManager: "Housing Loan Manager",
        createdDate: "2026-06-03"
    },
    {
        workItemNumber: "PL-0006",
        loanType: "Personal Loan",
        applicantName: "Michael Brown",
        loanAmount: "15000",
        status: "Pending",
        assignedManager: "Personal Loan Manager",
        createdDate: "2026-06-02"
    },
    {
        workItemNumber: "GL-0007",
        loanType: "Gold Loan",
        applicantName: "Ananya Rao",
        loanAmount: "12000",
        status: "Approved",
        assignedManager: "Gold Loan Manager",
        createdDate: "2026-06-01"
    },
    {
        workItemNumber: "ML-0008",
        loanType: "Mortgage Loan",
        applicantName: "David Wilson",
        loanAmount: "600000",
        status: "Rejected",
        assignedManager: "Mortgage Loan Manager",
        createdDate: "2026-05-30"
    }
];

let reportData = [];

document.addEventListener("DOMContentLoaded", function(){

    loadReportData();
    renderReports(reportData);
    setupSearch();

    const savedName =
        localStorage.getItem("secureFlowUserName") ||
        localStorage.getItem("userName") ||
        "Ved";

    document.getElementById("welcomeText").innerText = `Hi ${savedName}!`;
    document.querySelector(".avatar").innerText = savedName.charAt(0).toUpperCase();

});

function loadReportData(){

    reportData = [];

    for(let i = 0; i < localStorage.length; i++){

        const key = localStorage.key(i);

        if(
            key.startsWith("HL-") ||
            key.startsWith("CL-") ||
            key.startsWith("EL-") ||
            key.startsWith("PL-") ||
            key.startsWith("BL-") ||
            key.startsWith("GL-") ||
            key.startsWith("ML-")
        ){
            const item = JSON.parse(localStorage.getItem(key));
            reportData.push(item);
        }
    }

    if(reportData.length === 0){
        reportData = defaultReports;
    }
}

function renderReports(data){

    updateSummary(data);
    updateLoanDistribution(data);
    updateLoanBreakdown(data);
    updateTable(data);

}

function updateSummary(data){

    const total = data.length;
    const pending = data.filter(item => item.status === "Pending").length;
    const approved = data.filter(item => item.status === "Approved").length;
    const rejected = data.filter(item => item.status === "Rejected").length;

    document.getElementById("totalWorkflows").innerText = total;
    document.getElementById("pendingCount").innerText = pending;
    document.getElementById("approvedCount").innerText = approved;
    document.getElementById("rejectedCount").innerText = rejected;

    document.getElementById("pendingCircle").innerText = pending;
    document.getElementById("approvedCircle").innerText = approved;
    document.getElementById("rejectedCircle").innerText = rejected;

    document.getElementById("donutTotal").innerText = total;
}

function updateLoanDistribution(data){

    const loanCounts = {};

    data.forEach(item => {
        loanCounts[item.loanType] = (loanCounts[item.loanType] || 0) + 1;
    });

    const legend = document.getElementById("loanLegend");
    legend.innerHTML = "";

    const colors = ["#37dcb8", "#7d68ff", "#d9ff6a", "#ff8d8d", "#6acbff", "#f7b955", "#ef7cff", "#9cafaa"];

    Object.keys(loanCounts).forEach((loan, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="legend-dot" style="background:${colors[index % colors.length]}"></span>
            ${loan} - ${loanCounts[loan]}
        `;

        legend.appendChild(li);

    });
}

function updateLoanBreakdown(data){

    const breakdown = {};

    data.forEach(item => {

        if(!breakdown[item.loanType]){
            breakdown[item.loanType] = {
                total: 0,
                Pending: 0,
                Approved: 0,
                Rejected: 0
            };
        }

        breakdown[item.loanType].total++;
        breakdown[item.loanType][item.status]++;

    });

    const loanBreakdown = document.getElementById("loanBreakdown");
    loanBreakdown.innerHTML = "";

    Object.keys(breakdown).forEach(loanType => {

        const loan = breakdown[loanType];

        const card = document.createElement("div");
        card.className = "loan-card";

        card.innerHTML = `
            <h4>${loanType}</h4>

            <div class="loan-total">${loan.total}</div>

            <div class="loan-stats">
                <div>
                    <span>Pending</span>
                    <b>${loan.Pending}</b>
                </div>

                <div>
                    <span>Approved</span>
                    <b>${loan.Approved}</b>
                </div>

                <div>
                    <span>Rejected</span>
                    <b>${loan.Rejected}</b>
                </div>
            </div>
        `;

        loanBreakdown.appendChild(card);

    });
}

function updateTable(data){

    const tableBody = document.getElementById("reportTableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.workItemNumber}</td>
            <td>${item.loanType}</td>
            <td>${item.applicantName}</td>
            <td>$${Number(item.loanAmount).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${item.status.toLowerCase()}">
                    ${item.status}
                </span>
            </td>
            <td>${item.assignedManager}</td>
            <td>${formatDate(item.createdDate)}</td>
        `;

        tableBody.appendChild(row);

    });
}

function setupSearch(){

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function(){

        const searchValue = searchInput.value.toLowerCase();

        const filteredData = reportData.filter(item => {

            return (
                item.workItemNumber.toLowerCase().includes(searchValue) ||
                item.loanType.toLowerCase().includes(searchValue) ||
                item.applicantName.toLowerCase().includes(searchValue) ||
                item.status.toLowerCase().includes(searchValue) ||
                item.assignedManager.toLowerCase().includes(searchValue)
            );

        });

        renderReports(filteredData);

    });
}

function formatDate(dateValue){

    if(!dateValue){
        return "N/A";
    }

    const date = new Date(dateValue);

    if(isNaN(date.getTime())){
        return dateValue;
    }

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}