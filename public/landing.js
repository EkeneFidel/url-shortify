const jumboBtn = document.querySelector(".jumbo-btn");

const logout = document.querySelector(".logout");

if (logout) {
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
}

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
