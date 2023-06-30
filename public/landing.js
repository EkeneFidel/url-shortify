const jumboBtn = document.querySelector(".jumbo-btn");

jumboBtn.addEventListener("click", (e) => {
    if (jumboBtn.classList.contains("dashboard")) {
        location.pathname = "dashboard";
    } else {
        let newURL =
            window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "auth?type=signup";
        location.href = newURL;
    }
});
