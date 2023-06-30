const button = document.querySelector(".button");
const signUp = document.querySelector(".signup-link");
const errorMsg = document.querySelector(".error-text");
const loginForm = document.querySelector(".login-form");
const loginLoader = document.querySelector("#login-loader");
const loginBtn = document.querySelector("#login-btn");

const pwShowHide = document.querySelectorAll(".showHidePw");
const pwFields = document.querySelectorAll(".password");
function startLoad() {
    loginBtn.value = "";
    loginLoader.style.display = "block";
}

function stopLoad() {
    loginLoader.style.display = "none";
    loginBtn.value = "Change Password";
}

pwShowHide.forEach((eyeIcon) => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach((pwField) => {
            if (pwField.type === "password") {
                pwField.type = "text";

                pwShowHide.forEach((icon) => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                });
            } else {
                pwField.type = "password";

                pwShowHide.forEach((icon) => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                });
            }
        });
    });
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    startLoad();
    const passw = e.target.elements.password;
    const confirmPassw = e.target.elements.confirmPassword;
    console.log(passw.value, confirmPassw.value);
    if (passw.value !== confirmPassw.value) {
        stopLoad();
        errorMsg.style.display = "flex";
        errorMsg.innerHTML = `<svg
                        class="leafygreen-ui-12snj1w"
                        height="15"
                        width="15"
                        role="img"
                        aria-label="Warning Icon"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.8639 2.51357C8.49039 1.82881 7.50961 1.82881 7.1361 2.51357L1.12218 13.5388C0.763263 14.1968 1.23814 15 1.98608 15H14.0139C14.7619 15 15.2367 14.1968 14.8778 13.5388L8.8639 2.51357ZM7 6C7 5.44772 7.44772 5 8 5C8.55228 5 9 5.44772 9 6V10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10V6ZM9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13Z"
                            fill="currentColor"
                        ></path>
                    </svg> <p>Passwords do not match</p>`;
        setTimeout(() => {
            errorMsg.style.display = "none";
            errorMsg.querySelector("p").innerHTML = "";
        }, 5000);
    } else {
        const url = location.href;
        let arr = url.split("?");
        let id = arr[1].split("&")[1].split("=")[1];
        let token = arr[1].split("&")[0].split("=")[1];
        let finalUrl = `/auth/reset-password?token=${token}&id=${id}`;
        await fetch(finalUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: passw.value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                stopLoad();
                if (data.success === false) {
                    errorMsg.style.display = "flex";
                    errorMsg.innerHTML = `<svg
                            class="leafygreen-ui-12snj1w"
                            height="15"
                            width="15"
                            role="img"
                            aria-label="Warning Icon"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8.8639 2.51357C8.49039 1.82881 7.50961 1.82881 7.1361 2.51357L1.12218 13.5388C0.763263 14.1968 1.23814 15 1.98608 15H14.0139C14.7619 15 15.2367 14.1968 14.8778 13.5388L8.8639 2.51357ZM7 6C7 5.44772 7.44772 5 8 5C8.55228 5 9 5.44772 9 6V10C9 10.5523 8.55228 11 8 11C7.44772 11 7 10.5523 7 10V6ZM9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12C8.55228 12 9 12.4477 9 13Z"
                                fill="currentColor"
                            ></path>
                        </svg> <p>${data.message}</p>`;
                    setTimeout(() => {
                        errorMsg.style.display = "none";
                        errorMsg.querySelector("p").innerHTML = "";
                    }, 5000);
                } else {
                    errorMsg.style.display = "flex";
                    errorMsg.classList.add("success");
                    passw.value = "";
                    confirmPassw.value = "";
                    errorMsg.innerHTML = `<i class="uil uil-check-circle"></i> <p>${data.message}</p>`;
                    setTimeout(() => {
                        errorMsg.style.display = "none";
                        errorMsg.querySelector("p").innerHTML = "";
                        errorMsg.classList.remove("success");
                    }, 5000);

                    let newURL =
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        "/" +
                        "auth/change-password";
                    location.href = newURL;
                }
            });
    }
});
