const container = document.querySelector(".auth-container"),
    pwShowHide = document.querySelectorAll(".showHidePw"),
    pwFields = document.querySelectorAll(".password"),
    signUp = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link"),
    authBody = document.querySelector(".auth-body");

//   js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach((pwField) => {
            if (pwField.type === "password") {
                pwField.type = "text";

                pwShowHide.forEach((icon) => {
                    icon.innerHTML = "visibility";
                });
            } else {
                pwField.type = "password";

                pwShowHide.forEach((icon) => {
                    icon.textContent = "visibility_off";
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
