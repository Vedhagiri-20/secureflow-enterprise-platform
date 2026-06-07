const loanData = {

    home: {
        name: "Home Loan",
        prefix: "HL",
        manager: "Home Loan Manager",
        priority: "High",
        documents: [
            "Identity Proof",
            "Address Proof",
            "Income Proof",
            "Property Document"
        ]
    },

    housing: {
        name: "Housing Loan",
        prefix: "HL",
        manager: "Housing Loan Manager",
        priority: "High",
        documents: [
            "Identity Proof",
            "Address Proof",
            "Salary Slip",
            "Property Agreement"
        ]
    },

    car: {
        name: "Car Loan",
        prefix: "CL",
        manager: "Auto Loan Manager",
        priority: "Medium",
        documents: [
            "Identity Proof",
            "Income Proof",
            "Vehicle Quotation",
            "Bank Statement"
        ]
    },

    education: {
        name: "Education Loan",
        prefix: "EL",
        manager: "Education Loan Manager",
        priority: "Medium",
        documents: [
            "Identity Proof",
            "Admission Letter",
            "Fee Structure",
            "Academic Records"
        ]
    },

    personal: {
        name: "Personal Loan",
        prefix: "PL",
        manager: "Personal Loan Manager",
        priority: "Low",
        documents: [
            "Identity Proof",
            "Income Proof",
            "Bank Statement"
        ]
    },

    business: {
        name: "Business Loan",
        prefix: "BL",
        manager: "Business Banking Manager",
        priority: "High",
        documents: [
            "Business Registration",
            "Tax Document",
            "Bank Statement",
            "Financial Report"
        ]
    },

    gold: {
        name: "Gold Loan",
        prefix: "GL",
        manager: "Gold Loan Manager",
        priority: "Medium",
        documents: [
            "Identity Proof",
            "Address Proof",
            "Gold Ownership Proof"
        ]
    },

    mortgage: {
        name: "Mortgage Loan",
        prefix: "ML",
        manager: "Mortgage Loan Manager",
        priority: "High",
        documents: [
            "Identity Proof",
            "Property Document",
            "Income Proof",
            "Existing Loan Statement"
        ]
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

function generateWorkItemNumber(selectedLoan){

    let counter =
    localStorage.getItem("secureflow_counter");

    if(counter === null){

        counter = 1;

    }
    else{

        counter = parseInt(counter) + 1;

    }

    localStorage.setItem(
        "secureflow_counter",
        counter
    );

    const prefix =
    loanData[selectedLoan].prefix;

    return `${prefix}-${String(counter).padStart(4,"0")}`;
}

loanType.addEventListener("change", function(){

    const selectedLoan =
    loanType.value;

    if(selectedLoan === ""){

        managerName.value = "";
        priority.value = "";

        previewLoan.innerText =
        "Not selected";

        previewManager.innerText =
        "Manager";

        previewPriority.innerText =
        "Not selected";

        previewDocs.innerText =
        "0 documents";

        documentList.innerHTML =
        `<p>Please select a loan type.</p>`;

        return;
    }

    const data =
    loanData[selectedLoan];

    managerName.value =
    data.manager;

    priority.value =
    data.priority;

    previewLoan.innerText =
    data.name;

    previewManager.innerText =
    data.manager;

    previewPriority.innerText =
    data.priority;

    previewDocs.innerText =
    `${data.documents.length} documents`;

    documentList.innerHTML = "";

    data.documents.forEach(function(doc,index){

        const item =
        document.createElement("div");

        item.className =
        "document-upload";

        item.innerHTML = `
            <label>${doc}</label>
            <input type="file" id="doc${index}">
        `;

        documentList.appendChild(item);

    });

});

priority.addEventListener("change", function(){

    previewPriority.innerText =
    priority.value || "Not selected";

});

workflowForm.addEventListener("submit", function(event){

    event.preventDefault();

    errorMessage.innerText = "";

    const applicantName =
    document.getElementById("applicantName").value.trim();

    const email =
    document.getElementById("email").value.trim();

    const phone =
    document.getElementById("phone").value.trim();

    const loanAmount =
    document.getElementById("loanAmount").value.trim();

    const description =
    document.getElementById("description").value.trim();

    const employmentType =
    document.getElementById("employmentType").value;

    const idType =
    document.getElementById("idType").value;

    const idNumber =
    document.getElementById("idNumber").value.trim();

    const address =
    document.getElementById("address").value.trim();

    if(loanType.value === ""){
        errorMessage.innerText =
        "Please select loan type";
        return;
    }

    if(loanAmount === ""){
        errorMessage.innerText =
        "Loan amount is mandatory";
        return;
    }

    if(applicantName === ""){
        errorMessage.innerText =
        "Applicant name is mandatory";
        return;
    }

    if(email === ""){
        errorMessage.innerText =
        "Email is mandatory";
        return;
    }

    if(phone === ""){
        errorMessage.innerText =
        "Phone number is mandatory";
        return;
    }

    if(employmentType === ""){
        errorMessage.innerText =
        "Select employment type";
        return;
    }

    if(idType === ""){
        errorMessage.innerText =
        "Select government ID";
        return;
    }

    if(idNumber === ""){
        errorMessage.innerText =
        "Government ID number required";
        return;
    }

    if(address === ""){
        errorMessage.innerText =
        "Address required";
        return;
    }

    const workItemNumber =
    generateWorkItemNumber(
        loanType.value
    );

    const selectedData =
    loanData[loanType.value];

    const workflowRequest = {

        workItemNumber:
        workItemNumber,

        loanType:
        selectedData.name,

        loanAmount:
        loanAmount,

        priority:
        priority.value,

        assignedManager:
        selectedData.manager,

        applicantName:
        applicantName,

        email:
        email,

        phone:
        phone,

        employmentType:
        employmentType,

        idType:
        idType,

        idNumber:
        idNumber,

        address:
        address,

        description:
        description,

        status:
        "Pending",

        createdDate:
        new Date().toISOString(),

        route: [
            "Employee",
            selectedData.manager,
            "Senior Manager"
        ]

    };

    console.log(
        "Workflow Created",
        workflowRequest
    );

    localStorage.setItem(
        workItemNumber,
        JSON.stringify(workflowRequest)
    );

    alert(
        `Workflow Created Successfully!\n\nWork Item Number: ${workItemNumber}`
    );

    workflowForm.reset();

    managerName.value = "";

    previewLoan.innerText =
    "Not selected";

    previewManager.innerText =
    "Manager";

    previewPriority.innerText =
    "Not selected";

    previewDocs.innerText =
    "0 documents";

    documentList.innerHTML =
    `<p>Please select a loan type.</p>`;
});