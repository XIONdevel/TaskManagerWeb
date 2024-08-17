declare var toastr: Toastr;

document.getElementById('loginForm')?.addEventListener('submit', async function (event: Event) {
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

    console.log("Fetching");

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Connection": "keep-alive",
            "Accept": "/"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(response => {
        const status: number = response.status;
        console.log("Status: " + status);
        if (status === 200) {
            window.location.href = "/";
        } else if (status === 409) {
            toastr.error("Username is taken");
        } else {
            toastr.info("Status: " + status);
        }
    })
    console.log("Past");
});
