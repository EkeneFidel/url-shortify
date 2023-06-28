// ============== SIDE BAR ====================
const mainLeft = document.querySelector(".main-left");
const navBar = document.querySelector(".nav-bar");
const navClose = document.querySelector(".nav-close");
const createButton = document.querySelector(".create-button");
const cancelButton = document.querySelector(".cancel-button");
const urlForm = document.querySelector(".url-form");
const linkInput = document.querySelectorAll(".link-input");
const longUrl = document.querySelector("#long-url");
const shortUrl = document.querySelector("#short-url");

createButton.addEventListener("click", (e) => {
    if (longUrl.value === "") {
        linkInput[0].querySelector("span").innerHTML = "Provide a valid url";
        linkInput[0].querySelector("span").style.display = "block";
        linkInput[0].classList.add("error");
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
