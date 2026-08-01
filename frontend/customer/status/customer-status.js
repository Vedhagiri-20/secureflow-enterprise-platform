document.addEventListener("DOMContentLoaded", function () {
    loadApplications();
});

function loadApplications() {
    const applications =
        JSON.parse(localStorage.getItem("customerLoanApplications")) || [];

    const container = document.getElementById("applicationContainer");
    const emptyState = document.getElementById("emptyState");

    container.innerHTML = "";

    if (applications.length === 0) {
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    applications.forEach(application => {
        container.innerHTML += createApplicationCard(application);
    });
}

function createApplicationCard(application) {
    const roadmap = getRoadmap(application.status);

    return `
        <div class="application-card">

            <div class="application-header">
                <div>
                    <h2>${application.applicationId}</h2>
                    <p>${formatDate(application.createdDate)}</p>
                </div>

                <div class="status-pill">${application.status}</div>
            </div>

            <div class="details-grid">

                <div class="detail-box">
                    <p>Loan Type</p>
                    <h3>${application.loanType}</h3>
                </div>

                <div class="detail-box">
                    <p>Amount</p>
                    <h3>$${Number(application.loanAmount).toLocaleString()}</h3>
                </div>

                <div class="detail-box">
                    <p>Eligibility</p>
                    <h3>${application.eligibilityScore}</h3>
                </div>

                <div class="detail-box">
                    <p>Current Stage</p>
                    <h3>${application.currentStage}</h3>
                </div>

            </div>

            <div class="workflow-title">Application Roadmap</div>

            <div class="status-roadmap">

                <div class="road-step ${roadmap.customer}">
                    <div class="road-dot"></div>
                    <h4>Submitted</h4>
                    <p>Your application has been submitted successfully.</p>
                </div>

                <div class="road-step ${roadmap.employee}">
                    <div class="road-dot"></div>
                    <h4>Employee Review</h4>
                    <p>Bank employee verifies details and documents.</p>
                </div>

                <div class="road-step ${roadmap.manager}">
                    <div class="road-dot"></div>
                    <h4>Manager Review</h4>
                    <p>Manager reviews the verified application.</p>
                </div>

                <div class="road-step ${roadmap.final}">
                    <div class="road-dot"></div>
                    <h4>Final Decision</h4>
                    <p>Approval or rejection decision will appear here.</p>
                </div>

            </div>

        </div>
    `;
}

function getRoadmap(status) {
    if (status === "Pending Employee Review") {
        return {
            customer: "completed",
            employee: "active",
            manager: "",
            final: ""
        };
    }

    if (status === "Pending Manager Review") {
        return {
            customer: "completed",
            employee: "completed",
            manager: "active",
            final: ""
        };
    }

    if (status === "Approved") {
        return {
            customer: "completed",
            employee: "completed",
            manager: "completed",
            final: "completed"
        };
    }

    if (status === "Rejected") {
        return {
            customer: "completed",
            employee: "completed",
            manager: "completed",
            final: "rejected"
        };
    }

    return {
        customer: "active",
        employee: "",
        manager: "",
        final: ""
    };
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}