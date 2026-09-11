const API_URL =
    "http://localhost:8080/api/eligibility/check";

const email =
    localStorage.getItem(
        "secureFlowUserEmail"
    );

const role =
    localStorage.getItem(
        "secureFlowUserRole"
    );

const token =
    localStorage.getItem(
        "secureFlowToken"
    );

if (!email
        || role !== "CUSTOMER"
        || !token) {

    window.location.href =
        "../../auth/login/login.html";
}

document.getElementById(
    "eligibilityForm"
).addEventListener(
    "submit",
    checkEligibility
);

async function checkEligibility(event) {
    event.preventDefault();

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    errorMessage.textContent = "";

    const requestBody = {
        loanType:
            document.getElementById(
                "loanType"
            ).value,

        age:
            Number(
                document.getElementById(
                    "age"
                ).value
            ),

        monthlyIncome:
            Number(
                document.getElementById(
                    "monthlyIncome"
                ).value
            ),

        employmentType:
            document.getElementById(
                "employmentType"
            ).value,

        creditScore:
            Number(
                document.getElementById(
                    "creditScore"
                ).value
            ),

        existingEmi:
            Number(
                document.getElementById(
                    "existingEmi"
                ).value
            ),

        requestedAmount:
            Number(
                document.getElementById(
                    "requestedAmount"
                ).value
            ),

        tenureMonths:
            Number(
                document.getElementById(
                    "tenureMonths"
                ).value
            )
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

            localStorage.clear();

            window.location.href =
                "../../auth/login/login.html";

            return;
        }

        if (!response.ok) {
            const data =
                await response.json()
                    .catch(() => ({}));

            throw new Error(
                data.message
                    || "Eligibility check failed"
            );
        }

        const data =
            await response.json();

        showResult(data);

    } catch (error) {
        errorMessage.textContent =
            error.message
            || "Unable to calculate eligibility.";

        console.error(error);
    }
}

function showResult(data) {
    document.getElementById(
        "emptyResult"
    ).classList.add("hidden");

    document.getElementById(
        "result"
    ).classList.remove("hidden");

    document.getElementById(
        "score"
    ).textContent =
        data.eligibilityScore;

    document.getElementById(
        "riskLevel"
    ).textContent =
        data.riskLevel;

    document.getElementById(
        "capacity"
    ).textContent =
        formatAmount(
            data.suggestedCapacity
        );

    document.getElementById(
        "interestRange"
    ).textContent =
        data.interestRange;

    document.getElementById(
        "recommendation"
    ).textContent =
        data.recommendation;
}

function formatAmount(value) {
    return Number(value)
        .toLocaleString(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0
            }
        );
}
