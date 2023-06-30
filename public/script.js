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

    payload.email = email.value;
    payload.password = passw.value;
    try {
        await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                setTimeout(() => {}, 5000);
                stopLoad("login");
                if (data.success === false) {
                    errorMsg[0].style.display = "flex";
                    errorMsg[0].querySelector("p").innerHTML = data.message;
                    setTimeout(() => {
                        errorMsg[0].style.display = "none";
                        errorMsg[0].querySelector("p").innerHTML = "";
                    }, 2000);
                } else {
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

    if (passw.value !== confirmPassw.value) {
        stopLoad("signup");
        errorMsg[1].style.display = "flex";
        errorMsg[1].querySelector("p").innerHTML = "Passwords do not match";
        setTimeout(() => {
            errorMsg[1].style.display = "none";
            errorMsg[1].querySelector("p").innerHTML = "";
        }, 5000);
    } else if (!checkboxSignup.checked) {
        errorMsg[1].style.display = "flex";
        errorMsg[1].querySelector("p").innerHTML =
            "Please indicate that you have read and agree to the Terms and Conditions";
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
                email: email.value,
                userName: userName.value,
                password: passw.value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                stopLoad("signup");
                if (data.success === false) {
                    errorMsg[1].style.display = "flex";
                    errorMsg[1].querySelector("p").innerHTML = data.message;
                    setTimeout(() => {
                        errorMsg[1].style.display = "none";
                        errorMsg[1].querySelector("p").innerHTML = "";
                    }, 5000);
                } else {
                    errorMsg[1].style.display = "flex";
                    errorMsg[1].classList.add("success");
                    errorMsg[1].innerHTML = `<i class="uil uil-check-circle"></i> <p>${data.message}</p>`;

                    stopLoad("signup");
                    setTimeout(() => {
                        errorMsg[1].style.display = "none";
                        errorMsg[1].querySelector("p").innerHTML = "";
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
