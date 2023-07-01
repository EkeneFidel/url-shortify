const dashboardSidebarItem = document.querySelector("#dashboard");
const linksSidebarItem = document.querySelector("#links");
const analyticsSidebarItem = document.querySelector("#analytics");
const settingsSidebarItem = document.querySelector("#settings");

const mainLeft = document.querySelector(".main-left");
const navBar = document.querySelector(".nav-bar");
const navClose = document.querySelector(".nav-close");

const linkList = document.querySelector(".link-list");
const linkInfo = document.querySelector(".link-info");
const linkTabs = document.querySelector(".link-tabs");
const linkMenu = document.querySelector(".link-menu");
const linkDetail = document.querySelector(".link-detail");
const links = document.querySelector(".links");
const clicks = document.querySelector(".clicks");
const qrcodes = document.querySelector(".qrcodes");
const countries = document.querySelector(".countries");
const copyBtn = document.querySelector(".copy-btn");
const qrcodeBtn = document.querySelector(".qrcode-btn");
const qrcodeDetails = document.querySelector(".qrcode-details");
const shortUrl = document.querySelector(".short-url");
const deleteBtn = document.querySelector(".delete");
let selected = 0;
let idsToDelete = [];

const logo = document.querySelector(".logo");

const authList = document.querySelector(".auth-list");
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
logo.addEventListener("click", (e) => {
    if (e.target.closest(".logo")) {
        location.pathname = "/";
    }
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

async function getAllLinks() {
    try {
        await fetch("/url/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let template =
                        '<% if (urls.length) { %> <% urls.forEach(function(url){ %> <div class="link-item" id="<%= url._id %>" > <input type="checkbox" id="termCon" /> <div class="details"> <div class="date"> <%= new Date(url.createdAt).toLocaleString("en-GB", { month: "long", day:"numeric"}) %> </div> <div class="url"> <%= url.shortUrl %> </div> <div class="clicks"> <span> <%= url.visits %> </span> <% if (url.visits === 1) { %> click <% }else{ %> clicks <% } %> </div> </div> </div> <% }); %> <% }else{ %> <div class="empty"> No Links Created </div> <% } %>';
                    let html = ejs.render(template, {
                        urls: data.data,
                    });
                    linkList.innerHTML = html;
                    if (!data.data.length) {
                        linkList.querySelector(".empty").style.display =
                            "block";
                    }
                } else {
                    console.log(data.success);
                }
            });
    } catch (error) {
        console.log(error);
    }
}

async function getAnalytics() {
    try {
        await fetch("/analytics/data", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    links.querySelector("h1").innerHTML = data.data.totalLinks;
                    clicks.querySelector("h1").innerHTML =
                        data.data.totalVisits;
                    qrcodes.querySelector("h1").innerHTML =
                        data.data.totalQrcodes;
                    countries.querySelector("h1").innerHTML =
                        data.data.totalCountries;
                }
            });
    } catch (error) {}
}

async function handleListItemClick() {
    linkList.addEventListener("click", async (e) => {
        if (!e.target.type) {
            let item = e.target.closest(".link-item");
            let items = linkList.querySelectorAll(".link-item");
            items.forEach((item) => {
                item.classList.remove("active");
            });
            item.classList.add("active");
            let url = `/url/${item.id}`;

            await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        let template =
                            '<div class="details"> <i class="uil uil-times close"></i> <div class="link-info"> <div class="short-url"> <a href="<%= url.longUrl %>" ><%= url.shortUrl %></a><button class="button copy-btn"><i class="uil uil-copy"></i>Copy</button></div><div class="clicks"><b><%= url.visits %></b><% if (url.visits === 1) { %> click <% }else{ %> clicks <% } %></div><div class="long-url"><iclass="uil uil-corner-down-right"></i><p><%= url.longUrl %></p></div><div class="date"><%= `${new Date(url.createdAt).toLocaleString("en-GB", {month: "long",day:"numeric"})}, ${new Date(url.createdAt).toLocaleString("en-GB",{year: "numeric"})}` %></div></div><h3>QR Code</h3><div class="qrcode-details"><% if (url.qrcode) { %><img src="<%= url.qrcode %>" alt="" /><% }else{ %> <button class="button qrcode-btn">Create QR Code</button> <% } %></div></div>';
                        let html = ejs.render(template, {
                            url: data.data,
                        });
                        linkDetail.innerHTML = html;
                        let mediaQuery = window.matchMedia(
                            "screen and (max-width: 425px)"
                        );
                        if (mediaQuery.matches) {
                            linkDetail.style.display = "block";
                            linkMenu.style.display = "none";
                        }
                    }
                });
        } else {
            let item = e.target.closest(".link-item");
            if (e.target.checked) {
                selected++;
                linkTabs.querySelector("p").innerHTML = `${selected} selected`;
                linkTabs.querySelector("p").style.display = "block";
                idsToDelete.push(item.id);
            } else {
                selected--;
                const index = idsToDelete.indexOf(item.id);
                idsToDelete.splice(index, 1);
                if (selected === 0) {
                    linkTabs.querySelector("p").style.display = "none";
                } else {
                    linkTabs.querySelector(
                        "p"
                    ).innerHTML = `${selected} selected`;
                }
            }
        }
    });
}

async function handleListDetailClick() {
    linkDetail.addEventListener("click", async (e) => {
        if (
            e.target.classList.contains("copy-btn") ||
            e.target.classList.contains("uil-copy")
        ) {
            if (e.target.closest(".copy-btn")) {
                navigator.clipboard.writeText(
                    linkDetail.querySelector(".short-url").querySelector("a")
                        .textContent
                );
                linkDetail.querySelector(".copy-btn").innerHTML =
                    '<i class="uil uil-copy"></i>Copied!';
            }
        } else if (e.target.classList.contains("qrcode-btn")) {
            try {
                let shortArr = linkDetail
                    .querySelector(".short-url")
                    .querySelector("a")
                    .textContent.split("/");
                let urlCode = shortArr[shortArr.length - 1];
                fetch("/url/qrcode", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        urlCode: urlCode,
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            const image = document.createElement("img");
                            image.src = data.data;
                            linkDetail
                                .querySelector(".qrcode-details")
                                .insertBefore(
                                    image,
                                    linkDetail.querySelector(".qrcode-details")
                                        .firstChild
                                );
                            linkDetail.querySelector(
                                ".qrcode-btn"
                            ).style.display = "none";
                            getAnalytics();
                        }
                    });
            } catch {}
        } else if (e.target.classList.contains("close")) {
            linkDetail.style.display = "none";
            linkMenu.style.display = "block";
        }
    });
}

async function handleDelete() {
    deleteBtn.addEventListener("click", async (e) => {
        if (idsToDelete.length) {
            await fetch("url/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: idsToDelete,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        console.log(data);
                        getAllLinks();
                        getAnalytics();
                    } else {
                        console.log(data);
                    }
                });
        }
    });
}

window.onload = () => {
    getAllLinks();
    getAnalytics();
    handleListItemClick();
    handleListDetailClick();
    handleDelete();
};
