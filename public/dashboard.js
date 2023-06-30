// ============== SIDE BAR ====================
const mainLeft = document.querySelector(".main-left");
const logo = document.querySelector(".logo");
const navBar = document.querySelector(".nav-bar");
const navClose = document.querySelector(".nav-close");
const createButton = document.querySelector(".create-button");
const cancelButton = document.querySelector(".cancel-button");
const urlForm = document.querySelector(".url-form");
const mainRight = document.querySelector(".main-right");
const linkInput = document.querySelectorAll(".link-input");
const longUrl = document.querySelector("#long-url");
const shortUrl = document.querySelector("#short-url");
const dashboardSidebarItem = document.querySelector("#dashboard");
const linksSidebarItem = document.querySelector("#links");
const analyticsSidebarItem = document.querySelector("#analytics");
const settingsSidebarItem = document.querySelector("#settings");
const alert = document.querySelectorAll(".alert");
function goToTab(id) {
    location.pathname = id;
}

// Close error alert
for (let i = 0; i < alert.length; i++) {
    alert[i].querySelector("span").addEventListener("click", (e) => {
        alert[i].style.display = "none";
        alert[i].style.opacity = "0";
        setTimeout(function () {
            alert[i].style.display = "none";
        }, 600);
    });
}

logo.addEventListener("click", (e) => {
    if (e.target.closest(".logo")) {
        location.pathname = "/";
    }
});

createButton.addEventListener("click", async (e) => {
    if (longUrl.value === "") {
        linkInput[0].querySelector("span").innerHTML = "Provide a valid url";
        linkInput[0].querySelector("span").style.display = "block";
        linkInput[0].classList.add("error");
    }

    try {
        const payload = {
            longUrl: linkInput[0].querySelector("input").value,
            customCode: linkInput[1].querySelector("input").value,
        };
        await fetch("/url/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === false) {
                    if (data.status === 500) {
                        const errorDiv = `<div class="alert">
                            <span class="closebtn">&times;</span>
                            ${data.message}
                        </div>`;
                        mainRight.insertBefore(errorDiv, mainRight.firstChild);
                    }
                    linkInput[0].querySelector("span").innerHTML = data.message;
                    linkInput[0].querySelector("span").style.display = "block";
                    linkInput[0].classList.add("error");
                } else {
                    location.pathname = "links";
                }
            });
    } catch (error) {
        // setTimeout(function () {
        //     alert[i].style.display = "none";
        // }, 600);

        console.log(errorDiv);
    }
});

linkInput[0].addEventListener("keyup", (e) => {
    linkInput[0].querySelector("span").style.display = "none";
    linkInput[0].classList.remove("error");
});

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
