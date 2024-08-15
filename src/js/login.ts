declare var toastr: Toastr;

document.getElementById('loginForm')?.addEventListener('submit', function (event: Event) {
    event.preventDefault();
    const regex = /^[A-Za-z0-9]+$/;

    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const username: string = usernameInput.value;
    const password: string = passwordInput.value;

    if (!regex.test(username)) {
        toastr.error("Username can contain only letters and numbers");
        return;
    }

    fetch("http://localhost:8080/api/auth/authenticate", {
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
        } else if (status == 403){
            toastr.error("Incorrect login or password");
        }
    })
});