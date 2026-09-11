const API_URL =
    "http://localhost:8080/api/customer/applications";

const customerEmail =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const customerRole =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

if (!customerEmail
        || customerRole !== "CUSTOMER"
        || !token) {

    window.location.href =
        "../../auth/login/login.html";
}

const loanData = {
    home: {
        id: 1,
        name: "Home Loan",
        priority: "High",
        documents: [
            "Identity Proof",
            "Address Proof",
            "Income Proof",
            "Property Document"
        ]
    },

    car: {
        id: 2,
        name: "Car Loan",
        priority: "Medium",
        documents: [
            "Identity Proof",
            "Income Proof",
            "Vehicle Quotation",
            "Bank Statement"
        ]
    },

    education: {
        id: 3,
        name: "Education Loan",
        priority: "Medium",
        documents: [
            "Identity Proof",
            "Admission Letter",
            "Fee Structure",
            "Academic Records"
        ]
    },

    business: {
        id: 4,
        name: "Business Loan",
        priority: "High",
        documents: [
            "Business Registration",
            "Tax Document",
            "Bank Statement",
            "Financial Report"
        ]
    }
};

const form =
    document.getElementById(
        "workflowForm"
    );

const loanType =
    document.getElementById(
        "loanType"
    );

const errorMessage =
    document.getElementById(
        "errorMessage"
    );

const documentList =
    document.getElementById(
        "documentList"
    );

const previewLoan =
    document.getElementById(
        "previewLoan"
    );

const previewPriority =
    document.getElementById(
        "previewPriority"
    );

const previewDocs =
    document.getElementById(
        "previewDocs"
    );

document.getElementById(
    "accountEmail"
).value = customerEmail || "";

loanType.addEventListener(
    "change",
    updateLoanPreview
);

form.addEventListener(
    "submit",
    submitApplication
);

function updateLoanPreview() {
    const selectedLoan =
        loanData[loanType.value];

    if (!selectedLoan) {
        previewLoan.textContent =
            "Not selected";

        previewPriority.textContent =
            "Auto assigned";

        previewDocs.textContent =
            "0 documents";

        documentList.innerHTML = `
            <p>
                Select a loan type to view
                the expected documents.
            </p>
        `;

        return;
    }

    previewLoan.textContent =
        selectedLoan.name;

    previewPriority.textContent =
        selectedLoan.priority;

    previewDocs.textContent =
        `${selectedLoan.documents.length} documents`;

    documentList.innerHTML =
        selectedLoan.documents
            .map(documentName => `
                <div class="document-upload">
                    <label>
                        ${documentName}
                    </label>

                    <p>
                        Document upload will be
                        available in Phase 2.
                    </p>
                </div>
            `)
            .join("");
}

async function submitApplication(event) {
    event.preventDefault();

    errorMessage.textContent = "";

    const selectedLoan =
        loanData[loanType.value];

    if (!selectedLoan) {
        errorMessage.textContent =
            "Please select a loan type.";
        return;
    }

    const loanAmount =
        Number(
            document.getElementById(
                "loanAmount"
            ).value
        );

    if (!loanAmount
            || loanAmount <= 0) {
        errorMessage.textContent =
            "Please enter a valid loan amount.";
        return;
    }

    const requestBody = {
        loanTypeId:
            selectedLoan.id,

        applicantName:
            document.getElementById(
                "applicantName"
            ).value.trim(),

        applicantPhone:
            document.getElementById(
                "phone"
            ).value.trim(),

        loanAmount:
            loanAmount,

        loanPurpose:
            document.getElementById(
                "description"
            ).value.trim(),

        employmentType:
            document.getElementById(
                "employmentType"
            ).value,

        governmentIdType:
            document.getElementById(
                "idType"
            ).value,

        governmentIdNumber:
            document.getElementById(
                "idNumber"
            ).value.trim(),

        residentialAddress:
            document.getElementById(
                "address"
            ).value.trim()
    };

    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },
                body:
                    JSON.stringify(
                        requestBody
                    )
            }
        );

        if (response.status === 401
                || response.status === 403) {

            logout();
            return;
        }

        if (!response.ok) {
            const data =
                await response.json()
                    .catch(() => ({}));

            throw new Error(
                data.message
                    || "Application submission failed"
            );
        }

        const application =
            await response.json();

        document.getElementById(
            "successWorkItemNumber"
        ).textContent =
            application.workItemNumber;

        document.getElementById(
            "successModal"
        ).classList.add("show");

    } catch (error) {
        errorMessage.textContent =
            error.message
            || "Unable to submit application.";

        console.error(error);
    }
}

function goToDashboard() {
    window.location.href =
        "../../dashboard/customer/customer-dashboard.html";
}

function logout() {
    localStorage.clear();

    window.location.href =
        "../../auth/login/login.html";
}
