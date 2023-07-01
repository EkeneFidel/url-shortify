const emailConfirmed = document.querySelector(".email-confirmed");

let id;
let token;

async function verify() {
    try {
        const url = location.href;
        let arr = url.split("/");
        [id, token] = arr[arr.length - 1].split("?token=");

        await fetch(`/verify-email/${id}?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success === false) {
                    emailConfirmed.innerHTML = `<i class="uil uil-times-circle email"></i> <div class="message"> <p>${data.message}</p> </div><a class="text resend" >Resend Verification</a>`;
                } else {
                    emailConfirmed.innerHTML = `<i class="uil uil-check-circle email"></i> <div class="message"> <p>${data.message}</p> <a class="text" href="/auth?type=login">Login Now</a>`;
                }
            });
    } catch (error) {}
}

emailConfirmed.addEventListener("click", async (e) => {
    if (e.target.classList.contains("resend")) {
        await fetch(`/verify-email/resend-verification/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    emailConfirmed.innerHTML = `<i class="uil uil-check-circle email"></i> <div class="message"> <p>${data.message}</p> <a class="text" href="/auth?type=login">Login Now</a>`;
                } else {
                    emailConfirmed.innerHTML = `<i class="uil uil-times-circle email"></i> <div class="message"> <p>${data.message}</p> </div><a class="text resend" >Resend Verification</a>`;
                }
            });
    }
});

window.onload = () => {
    verify();
};
