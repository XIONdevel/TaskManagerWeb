declare var toastr: Toastr;

document.getElementById('registrationForm')?.addEventListener('submit', function (event: Event) {
    event.preventDefault();
    const regex = /^[A-Za-z0-9]+$/;

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPassInput = document.getElementById("confirmPassword") as HTMLInputElement;

    const username: string = usernameInput.value;
    const password: string = passwordInput.value;
    const confirmPassword: string = confirmPassInput.value;

    if (!regex.test(username)) {
        toastr.error("Username can contain only letters and numbers");
        return;
    } else if (password != confirmPassword) {
        toastr.error("Passwords does not match");
        return;
    }

    fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
        const status = response.status;
        if (status === 200) {
            window.location.href = "/";
        } else if (status === 409) {
            toastr.error("Username is taken");
        }
    })
});