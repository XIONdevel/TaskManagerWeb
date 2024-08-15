declare var toastr: Toastr;

document.addEventListener("DOMContentLoaded", async function () {
    if (!isAuthenticated()) {
        loadAuthButtons();
        toastr.error("Please, login or register");
        await sleep(10000);
        window.location.href = "/login";
    }

    loadPageParts();
});

function loadPageParts() {
    createHTMLBase();
    loadHeader();
    loadSidePanel();
    loadTasks();
}

function loadAuthButtons(): void {
    const mainContainer = document.getElementById("mainContainer") as HTMLDivElement;

    const authDiv = document.createElement("div");
    const loginBtn = document.createElement("button");
    const registerBtn =  document.createElement("button");

    authDiv.id = "authDiv";

    loginBtn.id = "loginBtn";
    loginBtn.innerText = "Login";

    registerBtn.id = "registerBtn";
    registerBtn.innerText = "Register";

    loginBtn.addEventListener('click', function (): void {
        window.location.href = "/login";
    })
    registerBtn.addEventListener('click', function (): void{
        window.location.href = "/register";
    })

    authDiv.appendChild(loginBtn);
    authDiv.appendChild(registerBtn);
    mainContainer.appendChild(authDiv);
}

function createHTMLBase(): void {
    const mainContainer = document.getElementById("mainContainer") as HTMLDivElement;

    const headerDiv = document.createElement("div");
    headerDiv.id = "header";

    const sidePanelDiv = document.createElement("div");
    sidePanelDiv.id = "sidePanel";

    const taskContainerDiv = document.createElement("div");
    taskContainerDiv.id = "taskContainer";

    mainContainer.appendChild(headerDiv);
    mainContainer.appendChild(sidePanelDiv);
    mainContainer.appendChild(taskContainerDiv);
}

function loadHeader() {
    //TODO: implement
}

function loadTasks() {
    //TODO: implement
}

function loadSidePanel() {
    //TODO: implement
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isAuthenticated(): boolean {
    let result = false;

    fetch("http://localhost:8080/api/auth/check", {
        method: "POST",
        credentials: "include",
    }).then(response => {
        const status = response.status;
        result = status === 200;
    })

    return result;
}
