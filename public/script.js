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
    signupBtn = document.querySelector("#signup-btn");

function startLoad(type) {
    console.log(type);
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

    const email = e.target.elements.email;
    const passw = e.target.elements.password;
    try {
        await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: passw.value,
            }),
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
                    window.location.href = "http://localhost:3000/dashboard";
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
        }, 2000);
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
                    }, 2000);
                } else {
                    window.location.href = "http://localhost:3000/auth";
                    container.classList.remove("active");
                    authBody.classList.remove("active");
                }
            });
    }
});
