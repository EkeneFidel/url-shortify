const dashboardSidebarItem = document.querySelector("#dashboard");
const linksSidebarItem = document.querySelector("#links");
const analyticsSidebarItem = document.querySelector("#analytics");
const settingsSidebarItem = document.querySelector("#settings");
const authList = document.querySelector(".auth-list");

const mainLeft = document.querySelector(".main-left");
const navBar = document.querySelector(".nav-bar");
const navClose = document.querySelector(".nav-close");

const logo = document.querySelector(".logo");
logo.addEventListener("click", (e) => {
    if (e.target.closest(".logo")) {
        location.pathname = "/";
    }
});

authList.querySelector("a").addEventListener("click", async (e) => {
    await fetch("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                let newURL =
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    "/";
                location.href = newURL;
            } else {
                console.log(data);
            }
        });
});

function goToTab(id) {
    location.pathname = id;
}

navBar.addEventListener("click", (e) => {
    mainLeft.style.display = "flex";
    navBar.style.display = "none";
    navClose.style.display = "block";
});

navClose.addEventListener("click", (e) => {
    mainLeft.style.display = "none";
    navBar.style.display = "block";
    navClose.style.display = "none";
});

dashboardSidebarItem.addEventListener("click", (e) => {
    if (e.target.closest(`#${dashboardSidebarItem.id}`)) {
        goToTab(dashboardSidebarItem.id);
    }
});
linksSidebarItem.addEventListener("click", (e) => {
    if (e.target.closest(`#${linksSidebarItem.id}`)) {
        goToTab(linksSidebarItem.id);
    }
});
analyticsSidebarItem.addEventListener("click", (e) => {
    if (e.target.closest(`#${analyticsSidebarItem.id}`)) {
        goToTab(analyticsSidebarItem.id);
    }
});
settingsSidebarItem.addEventListener("click", (e) => {
    if (e.target.closest(`#${settingsSidebarItem.id}`)) {
        goToTab(settingsSidebarItem.id);
    }
});
