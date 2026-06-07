let notifications = [
    {
        id: 1,
        title: "Workflow Submitted",
        workItemNumber: "HL-0001",
        message: "Your home loan workflow has been submitted and routed to the Home Loan Manager.",
        status: "Pending",
        from: "System",
        time: "Today, 10:30 AM",
        unread: true,
        icon: "📄"
    },
    {
        id: 2,
        title: "Manager Approved Request",
        workItemNumber: "CL-0002",
        message: "Auto Loan Manager approved your car loan workflow and moved it to final review.",
        status: "Approved",
        from: "Auto Loan Manager",
        time: "Yesterday, 4:15 PM",
        unread: true,
        icon: "✅"
    },
    {
        id: 3,
        title: "Document Required",
        workItemNumber: "EL-0003",
        message: "Education Loan Manager requested an additional admission confirmation document.",
        status: "Info",
        from: "Education Loan Manager",
        time: "Yesterday, 1:05 PM",
        unread: false,
        icon: "📎"
    },
    {
        id: 4,
        title: "Workflow Rejected",
        workItemNumber: "ML-0008",
        message: "Mortgage Loan Manager rejected the workflow due to missing property verification details.",
        status: "Rejected",
        from: "Mortgage Loan Manager",
        time: "Jun 05, 2026",
        unread: false,
        icon: "❌"
    },
    {
        id: 5,
        title: "Senior Manager Review",
        workItemNumber: "BL-0004",
        message: "Your business loan workflow has been escalated to Senior Manager for final approval.",
        status: "Pending",
        from: "Business Banking Manager",
        time: "Jun 04, 2026",
        unread: true,
        icon: "🔔"
    }
];

document.addEventListener("DOMContentLoaded", function(){

    const savedName =
        localStorage.getItem("secureFlowUserName") ||
        localStorage.getItem("userName") ||
        "Ved";

    document.getElementById("welcomeText").innerText = `Hi ${savedName}!`;
    document.querySelector(".avatar").innerText = savedName.charAt(0).toUpperCase();

    loadNotifications();
    renderNotifications(notifications);
    setupSearch();

    document.getElementById("markAllReadBtn").addEventListener("click", markAllAsRead);

});

function loadNotifications(){

    const savedNotifications = localStorage.getItem("secureflow_notifications");

    if(savedNotifications){
        notifications = JSON.parse(savedNotifications);
    }
    else{
        localStorage.setItem("secureflow_notifications", JSON.stringify(notifications));
    }
}

function saveNotifications(){
    localStorage.setItem("secureflow_notifications", JSON.stringify(notifications));
}

function renderNotifications(data){

    updateCounts();

    const notificationList = document.getElementById("notificationList");
    notificationList.innerHTML = "";

    if(data.length === 0){
        notificationList.innerHTML = `
            <div class="empty-state">
                No notifications found.
            </div>
        `;
        return;
    }

    data.forEach(function(item){

        const card = document.createElement("div");
        card.className = item.unread ? "notification-card unread" : "notification-card";

        card.innerHTML = `
            <div class="notification-icon">${item.icon}</div>

            <div class="notification-content">
                <h3>${item.title}</h3>

                <p>${item.message}</p>

                <div class="meta-row">
                    <span>Work Item: ${item.workItemNumber}</span>
                    <span>From: ${item.from}</span>
                    <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span>
                </div>
            </div>

            <div class="notification-actions">
                <span class="time">${item.time}</span>
                <button class="read-btn" onclick="markAsRead(${item.id})" ${item.unread ? "" : "disabled"}>
                    ${item.unread ? "Mark as Read" : "Read"}
                </button>
            </div>
        `;

        notificationList.appendChild(card);

    });
}

function updateCounts(){

    const total = notifications.length;
    const unread = notifications.filter(item => item.unread).length;
    const approved = notifications.filter(item => item.status === "Approved").length;
    const rejected = notifications.filter(item => item.status === "Rejected").length;

    document.getElementById("totalCount").innerText = total;
    document.getElementById("unreadCount").innerText = unread;
    document.getElementById("approvedCount").innerText = approved;
    document.getElementById("rejectedCount").innerText = rejected;
}

function markAsRead(id){

    notifications = notifications.map(function(item){

        if(item.id === id){
            item.unread = false;
        }

        return item;

    });

    saveNotifications();
    renderNotifications(notifications);
}

function markAllAsRead(){

    notifications = notifications.map(function(item){
        item.unread = false;
        return item;
    });

    saveNotifications();
    renderNotifications(notifications);
}

function setupSearch(){

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function(){

        const value = searchInput.value.toLowerCase();

        const filtered = notifications.filter(function(item){

            return (
                item.title.toLowerCase().includes(value) ||
                item.workItemNumber.toLowerCase().includes(value) ||
                item.message.toLowerCase().includes(value) ||
                item.status.toLowerCase().includes(value) ||
                item.from.toLowerCase().includes(value)
            );

        });

        renderNotifications(filtered);

    });
}