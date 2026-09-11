const API_URL =
    "http://localhost:8080/api/customer/applications";

const POSTAL_API =
    "https://api.zippopotam.us";

const customerEmail =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const customerName =
    localStorage.getItem(
        "secureFlowUserName"
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
        terms: [
            120,
            180,
            240,
            360
        ],
        documents: [
            "Government-issued identification",
            "Proof of income",
            "Recent bank statements",
            "Property or purchase documentation"
        ]
    },


    car: {
        id: 2,
        name: "Auto Loan",
        priority: "Medium",
        terms: [
            24,
            36,
            48,
            60,
            72
        ],
        documents: [
            "Government-issued identification",
            "Proof of income",
            "Vehicle purchase agreement or quotation",
            "Recent bank statements"
        ]
    },


    education: {
        id: 3,
        name: "Education Loan",
        priority: "Medium",
        terms: [
            36,
            60,
            84,
            120
        ],
        documents: [
            "Government-issued identification",
            "Admission or enrollment confirmation",
            "Tuition or fee schedule",
            "Academic documentation"
        ]
    },


    business: {
        id: 4,
        name: "Business Loan",
        priority: "High",
        terms: [
            12,
            24,
            36,
            48,
            60
        ],
        documents: [
            "Government-issued identification",
            "Business registration documentation",
            "Recent business bank statements",
            "Tax or financial statements"
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

const requestedTerm =
    document.getElementById(
        "requestedTermMonths"
    );

const employmentType =
    document.getElementById(
        "employmentType"
    );

const employerName =
    document.getElementById(
        "employerName"
    );

const postalCode =
    document.getElementById(
        "postalCode"
    );

const countryCode =
    document.getElementById(
        "countryCode"
    );

const city =
    document.getElementById(
        "city"
    );

const stateProvince =
    document.getElementById(
        "stateProvince"
    );

const lookupButton =
    document.getElementById(
        "postalLookupButton"
    );

const lookupStatus =
    document.getElementById(
        "postalLookupStatus"
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


initializeApplicant();
initializeDateOfBirth();


loanType.addEventListener(
    "change",
    updateLoanPreview
);


employmentType.addEventListener(
    "change",
    updateEmploymentRequirements
);


lookupButton.addEventListener(
    "click",
    lookupPostalCode
);


postalCode.addEventListener(
    "blur",
    () => {
        if (postalCode.value.trim()
                && countryCode.value
                && countryCode.value !== "OTHER") {

            lookupPostalCode();
        }
    }
);


countryCode.addEventListener(
    "change",
    () => {
        clearLookupStatus();

        if (countryCode.value === "OTHER") {
            setLookupStatus(
                "Postal lookup is unavailable for manual country entry. Enter city and region manually.",
                "error"
            );
        }
    }
);


form.addEventListener(
    "submit",
    submitApplication
);


function initializeApplicant() {
    document.getElementById(
        "accountEmail"
    ).value =
        customerEmail || "";


    if (!customerName
            || customerName === customerEmail) {

        return;
    }


    const parts =
        customerName
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (parts.length === 1) {
        document.getElementById(
            "firstName"
        ).value =
            parts[0];

        return;
    }


    document.getElementById(
        "firstName"
    ).value =
        parts[0];


    document.getElementById(
        "lastName"
    ).value =
        parts[
            parts.length - 1
        ];


    if (parts.length > 2) {
        document.getElementById(
            "middleName"
        ).value =
            parts
                .slice(
                    1,
                    -1
                )
                .join(" ");
    }
}


function initializeDateOfBirth() {
    const today =
        new Date();

    today.setFullYear(
        today.getFullYear() - 18
    );

    document.getElementById(
        "dateOfBirth"
    ).max =
        today
            .toISOString()
            .split("T")[0];
}


function updateLoanPreview() {
    const selectedLoan =
        loanData[
            loanType.value
        ];


    requestedTerm.innerHTML = "";


    if (!selectedLoan) {

        requestedTerm.disabled =
            true;

        requestedTerm.innerHTML = `
            <option value="">
                Select loan type first
            </option>
        `;

        previewLoan.textContent =
            "Not selected";

        previewPriority.textContent =
            "Auto assigned";

        previewDocs.textContent =
            "0 documents";


        documentList.innerHTML = `
            <p class="document-placeholder">
                Select a loan type to view expected documents.
            </p>
        `;

        return;
    }


    requestedTerm.disabled =
        false;


    requestedTerm.innerHTML =
        `
            <option value="">
                Select requested term
            </option>
        `
        + selectedLoan.terms
            .map(
                months => `
                    <option value="${months}">
                        ${formatTerm(months)}
                    </option>
                `
            )
            .join("");


    previewLoan.textContent =
        selectedLoan.name;


    previewPriority.textContent =
        selectedLoan.priority;


    previewDocs.textContent =
        `${selectedLoan.documents.length} documents`;


    documentList.innerHTML =
        selectedLoan.documents
            .map(
                documentName => `
                    <div class="document-upload">

                        <label>
                            ${escapeHtml(
                                documentName
                            )}
                        </label>

                        <p>
                            May be requested during application review.
                        </p>

                    </div>
                `
            )
            .join("");
}


function formatTerm(months) {
    if (months % 12 === 0) {
        const years =
            months / 12;

        return `${months} months (${years} ${
            years === 1
                ? "year"
                : "years"
        })`;
    }

    return `${months} months`;
}


function updateEmploymentRequirements() {
    const value =
        employmentType.value;


    const required =
        [
            "Employed Full Time",
            "Employed Part Time",
            "Self Employed",
            "Business Owner"
        ].includes(value);


    employerName.required =
        required;
}


async function lookupPostalCode() {
    const country =
        countryCode.value;

    const postal =
        postalCode.value.trim();


    clearLookupStatus();


    if (!country) {
        setLookupStatus(
            "Select a country first.",
            "error"
        );

        countryCode.focus();

        return;
    }


    if (!postal) {
        setLookupStatus(
            "Enter a postal or ZIP code.",
            "error"
        );

        postalCode.focus();

        return;
    }


    if (country === "OTHER") {
        setLookupStatus(
            "Enter city and region manually for this country.",
            "error"
        );

        return;
    }


    lookupButton.disabled =
        true;

    lookupButton.textContent =
        "Searching...";


    try {
        const response =
            await fetch(
                `${POSTAL_API}/${encodeURIComponent(
                    country
                )}/${encodeURIComponent(
                    postal
                )}`
            );


        if (!response.ok) {
            throw new Error(
                "Postal code not found"
            );
        }


        const data =
            await response.json();


        if (!data.places
                || data.places.length === 0) {

            throw new Error(
                "Postal code not found"
            );
        }


        const place =
            data.places[0];


        city.value =
            place["place name"]
            || "";


        stateProvince.value =
            place["state"]
            || place["state abbreviation"]
            || "";


        setLookupStatus(
            `${city.value}, ${stateProvince.value} found. You may edit these values if needed.`,
            "success"
        );

    } catch (error) {
        setLookupStatus(
            "Address lookup was unavailable. Enter city and region manually.",
            "error"
        );

    } finally {
        lookupButton.disabled =
            false;

        lookupButton.textContent =
            "Find Address";
    }
}


function setLookupStatus(
    message,
    type
) {
    lookupStatus.textContent =
        message;

    lookupStatus.classList.remove(
        "success",
        "error"
    );

    if (type) {
        lookupStatus.classList.add(
            type
        );
    }
}


function clearLookupStatus() {
    lookupStatus.textContent =
        "";

    lookupStatus.classList.remove(
        "success",
        "error"
    );
}


async function submitApplication(event) {
    event.preventDefault();

    errorMessage.textContent =
        "";


    updateEmploymentRequirements();


    if (!form.checkValidity()) {
        form.reportValidity();

        return;
    }


    const selectedLoan =
        loanData[
            loanType.value
        ];


    if (!selectedLoan) {
        errorMessage.textContent =
            "Select a loan type.";

        return;
    }


    const requestBody = {

        loanTypeId:
            selectedLoan.id,

        applicantFirstName:
            value("firstName"),

        applicantMiddleName:
            value("middleName"),

        applicantLastName:
            value("lastName"),

        applicantPhone:
            value("phone"),

        dateOfBirth:
            value("dateOfBirth"),

        citizenshipStatus:
            value("citizenshipStatus"),

        loanAmount:
            numberValue(
                "loanAmount"
            ),

        loanPurpose:
            value("description"),

        requestedTermMonths:
            integerValue(
                "requestedTermMonths"
            ),

        employmentType:
            value("employmentType"),

        employerName:
            value("employerName"),

        jobTitle:
            value("jobTitle"),

        annualGrossIncome:
            numberValue(
                "annualGrossIncome"
            ),

        governmentIdType:
            value("idType"),

        governmentIdNumber:
            value("idNumber"),

        addressLine1:
            value("addressLine1"),

        addressLine2:
            value("addressLine2"),

        city:
            value("city"),

        stateProvince:
            value("stateProvince"),

        postalCode:
            value("postalCode"),

        countryCode:
            value("countryCode"),

        housingStatus:
            value("housingStatus"),

        monthlyHousingPayment:
            numberValue(
                "monthlyHousingPayment"
            )
    };


    try {
        const response =
            await fetch(
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


        const data =
            await response
                .json()
                .catch(
                    () => ({})
                );


        if (!response.ok) {
            throw new Error(
                data.message
                || "Application submission failed."
            );
        }


        document.getElementById(
            "successWorkItemNumber"
        ).textContent =
            data.workItemNumber;


        document.getElementById(
            "successModal"
        ).classList.add(
            "show"
        );

    } catch (error) {
        errorMessage.textContent =
            error.message
            || "Unable to submit application.";
    }
}


function value(id) {
    return document
        .getElementById(id)
        .value
        .trim();
}


function numberValue(id) {
    return Number(
        document.getElementById(
            id
        ).value
    );
}


function integerValue(id) {
    return Number.parseInt(
        document.getElementById(
            id
        ).value,
        10
    );
}


function escapeHtml(valueToEscape) {
    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(
            valueToEscape || ""
        );

    return element.innerHTML;
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
