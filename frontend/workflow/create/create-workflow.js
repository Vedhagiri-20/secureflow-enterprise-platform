const loanData = {
    home: {
        id: 1,
        name: "Home Loan",
        manager: "Home Loan Manager",
        priority: "High",
        documents: ["Identity Proof", "Address Proof", "Income Proof", "Property Document"]
    },
    car: {
        id: 2,
        name: "Car Loan",
        manager: "Auto Loan Manager",
        priority: "Medium",
        documents: ["Identity Proof", "Income Proof", "Vehicle Quotation", "Bank Statement"]
    },
    education: {
        id: 3,
        name: "Education Loan",
        manager: "Education Loan Manager",
        priority: "Medium",
        documents: ["Identity Proof", "Admission Letter", "Fee Structure", "Academic Records"]
    },
    business: {
        id: 4,
        name: "Business Loan",
        manager: "Business Banking Manager",
        priority: "High",
        documents: ["Business Registration", "Tax Document", "Bank Statement", "Financial Report"]
    }
};

const loanType = document.getElementById("loanType");
const managerName = document.getElementById("managerName");
const priority = document.getElementById("priority");
const documentList = document.getElementById("documentList");

const previewLoan = document.getElementById("previewLoan");
const previewManager = document.getElementById("previewManager");
const previewPriority = document.getElementById("previewPriority");
const previewDocs = document.getElementById("previewDocs");

const workflowForm = document.getElementById("workflowForm");
const errorMessage = document.getElementById("errorMessage");

loanType.addEventListener("change", function () {

    const selectedLoan = loanType.value;

    if (!loanData[selectedLoan]) {
        managerName.value = "";
        priority.value = "";
        previewLoan.innerText = "Not selected";
        previewManager.innerText = "Manager";
        previewPriority.innerText = "Not selected";
        previewDocs.innerText = "0 documents";
        documentList.innerHTML = `<p>Please select a loan type to view required documents.</p>`;
        return;
    }

    const data = loanData[selectedLoan];

    managerName.value = data.manager;
    priority.value = data.priority;

    previewLoan.innerText = data.name;
    previewManager.innerText = data.manager;
    previewPriority.innerText = data.priority;
    previewDocs.innerText = `${data.documents.length} documents`;

    documentList.innerHTML = "";

    data.documents.forEach(function (documentName, index) {
        const box = document.createElement("div");
        box.className = "document-upload";

        box.innerHTML = `
            <label>${documentName}</label>
            <input type="file" id="document${index}">
        `;

        documentList.appendChild(box);
    });
});

priority.addEventListener("change", function () {
    previewPriority.innerText = priority.value || "Not selected";
});

workflowForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    errorMessage.innerText = "";

    const selectedLoanKey = loanType.value;
    const selectedLoan = loanData[selectedLoanKey];

    const loanAmount = document.getElementById("loanAmount").value.trim();
    const description = document.getElementById("description").value.trim();
    const applicantName = document.getElementById("applicantName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const employmentType = document.getElementById("employmentType").value;
    const idType = document.getElementById("idType").value;
    const idNumber = document.getElementById("idNumber").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!selectedLoan) {
        errorMessage.innerText = "Please select a valid loan type.";
        return;
    }

    if (loanAmount === "") {
        errorMessage.innerText = "Please enter loan amount.";
        return;
    }

    if (applicantName === "") {
        errorMessage.innerText = "Please enter applicant name.";
        return;
    }

    if (email === "") {
        errorMessage.innerText = "Please enter applicant email.";
        return;
    }

    if (phone === "") {
        errorMessage.innerText = "Please enter phone number.";
        return;
    }

    if (employmentType === "") {
        errorMessage.innerText = "Please select employment type.";
        return;
    }

    if (idType === "") {
        errorMessage.innerText = "Please select government ID type.";
        return;
    }

    if (idNumber === "") {
        errorMessage.innerText = "Please enter government ID number.";
        return;
    }

    if (address === "") {
        errorMessage.innerText = "Please enter residential address.";
        return;
    }

    if (description === "") {
        errorMessage.innerText = "Please enter loan purpose.";
        return;
    }

    const loggedInEmployeeEmail =
        localStorage.getItem("secureFlowUserEmail") ||
        "employee@secureflow.com";

    const requestBody = {
        loanTypeId: selectedLoan.id,
        employeeEmail: loggedInEmployeeEmail,
        applicantName: applicantName,
        applicantEmail: email,
        applicantPhone: phone,
        loanAmount: Number(loanAmount),
        loanPurpose: description,
        employmentType: employmentType,
        governmentIdType: idType,
        governmentIdNumber: idNumber,
        residentialAddress: address,
        priority: priority.value
    };

    try {
        const response = await fetch("http://localhost:8080/api/workflows/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            errorMessage.innerText = "Failed to create workflow.";
            return;
        }

        document.getElementById("successWorkItemNumber").innerText =
            data.workItemNumber || "Generated";

        document.getElementById("successModal").classList.add("show");

    } catch (error) {
        console.error(error);
        errorMessage.innerText = "Backend server is not running. Please start Spring Boot.";
    }
});

function goToDashboard() {
    window.location.href = "../../dashboard/employee/employee-dashboard.html";
}