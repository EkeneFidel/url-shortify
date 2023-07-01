const container = document.querySelector(".auth-container"),
    pwShowHide = document.querySelectorAll(".showHidePw"),
    pwFields = document.querySelectorAll(".password"),
    signUp = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link"),
    authBody = document.querySelector(".auth-body"),
    loginForm = document.querySelector(".login-form"),
    signUpForm = document.querySelector(".signup-form"),
    errorMsg = document.querySelectorAll(".error-text"),
    signupLoader = document.querySelector("#signup-loader"),
    loginLoader = document.querySelector("#login-loader"),
    loginBtn = document.querySelector("#login-btn"),
    signupBtn = document.querySelector("#signup-btn"),
    checkboxLogin = document.querySelector(".checkbox-login"),
    checkboxSignup = document.querySelector(".checkbox-signup");

const logo = document.querySelector(".logo");
logo.addEventListener("click", (e) => {
    if (e.target.closest(".logo")) {
        location.pathname = "/";
    }
});

function startLoad(type) {
    if (type === "login") {
        loginBtn.value = "";
        loginLoader.style.display = "block";
    } else {
        signupBtn.value = "";
        signupLoader.style.display = "block";
    }
}

function stopLoad(type) {
    if (type === "login") {
        loginLoader.style.display = "none";
        loginBtn.value = "Login";
    } else {
        signupLoader.style.display = "none";
        signupBtn.value = "Signup";
    }
}
//   js code to show/hide password and change icon
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

// js code to appear signup and login form
signUp.addEventListener("click", () => {
    container.classList.add("active");
    authBody.classList.add("active");
});
login.addEventListener("click", () => {
    container.classList.remove("active");
    authBody.classList.remove("active");
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    startLoad("login");
    let payload = {};
    if (checkboxLogin.checked) {
        payload.remenber = true;
    }
    const email = e.target.elements.email;
    const passw = e.target.elements.password;

    payload.email = email.value.trim();
    payload.password = passw.value.trim();
    try {
        await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                setTimeout(() => {}, 5000);
                if (data.success === false) {
                    stopLoad("login");
                    errorMsg[0].style.display = "flex";
                    errorMsg[1].innerHTML = `<svg
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
                </svg> <p>"${data.message}"</p>`;
                    setTimeout(() => {
                        errorMsg[0].style.display = "none";
                        errorMsg[0].querySelector("p").innerHTML = "";
                    }, 2000);
                } else {
                    stopLoad("login");
                    let newURL =
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        "/" +
                        "dashboard";
                    location.href = newURL;
                }
            });
    } catch (err) {
        stopLoad("login");
    }
});

signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    startLoad("signup");

    const userName = e.target.elements.userName;
    const email = e.target.elements.email;
    const passw = e.target.elements.password;
    const confirmPassw = e.target.elements.confirmPassword;

    if (passw.value.trim() !== confirmPassw.value.trim()) {
        stopLoad("signup");
        errorMsg[1].style.display = "flex";
        errorMsg[1].innerHTML = `<svg
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
            errorMsg[1].style.display = "none";
            errorMsg[1].querySelector("p").innerHTML = "";
        }, 5000);
    } else if (!checkboxSignup.checked) {
        errorMsg[1].style.display = "flex";
        errorMsg[1].innerHTML = `<svg
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
    </svg> <p>Please indicate that you have read and agree to the Terms and Conditions</p>`;
        stopLoad("signup");
        setTimeout(() => {
            errorMsg[1].style.display = "none";
            errorMsg[1].querySelector("p").innerHTML = "";
        }, 5000);
    } else {
        await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value.trim(),
                userName: userName.value.trim(),
                password: passw.value.trim(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                stopLoad("signup");
                if (data.success === false) {
                    errorMsg[1].style.display = "flex";
                    errorMsg[1].innerHTML = `<svg
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
                </svg> <p>"${data.message}"</p>`;
                    setTimeout(() => {
                        errorMsg[1].style.display = "none";
                        errorMsg[1].querySelector("p").innerHTML = "";
                    }, 5000);
                } else {
                    errorMsg[1].classList.add("success");
                    errorMsg[1].style.display = "flex";
                    errorMsg[1].innerHTML = `<i class="uil uil-check-circle"></i> <p>${data.message}</p>`;

                    stopLoad("signup");
                    setTimeout(() => {
                        errorMsg[1].style.display = "none";
                        errorMsg[1].querySelector("p").innerHTML = "";
                        errorMsg[1].classList.remove("success");
                    }, 5000);
                    userName.value = "";
                    email.value = "";
                    passw.value = "";
                    confirmPassw.value = "";
                    checkboxSignup.checked = false;
                }
            });
    }
});
