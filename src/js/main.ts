declare var toastr: Toastr;

document.addEventListener("DOMContentLoaded", async function () {
    initScrollButtons();
    setupPopupWindow();
    initHeaderButtons();
    loadTasks();
});


function initHeaderButtons() {
    setupAddButton();
}

function setupPopupWindow() {
    const window = document.getElementById("backgroundDiv") as HTMLDivElement;
    window.addEventListener('click', cancelLogic);
}

function initScrollButtons() {
    const scrollUp = document.getElementById("scrollUpButton") as HTMLButtonElement;
    const scrollDown = document.getElementById("scrollDownButton") as HTMLButtonElement;

    scrollUp.addEventListener('click', function () {
        const container = document.getElementById("taskContainer") as HTMLDivElement;
        container.scrollBy({
            top: -180,
            behavior: 'smooth'
        });
    })

    scrollDown.addEventListener('click', function () {
        const container = document.getElementById("taskContainer") as HTMLDivElement;
        container.scrollBy({
            top: 180,
            behavior: 'smooth'
        });
    })
}

function setupAddButton() {
    const addButton = document.getElementById("add") as HTMLButtonElement;

    addButton.addEventListener('click', function () {
        const container = document.getElementById("popupContainer") as HTMLDivElement;
        container.innerHTML =
            "<div id='createSelection'>" +
            "<button id='BasicTaskButton' class='createButtons'>Task</button>" +
            "<button id='ProjectButton' class='createButtons'>Project</button>" +
            "</div>";

        const basicTaskButton = document.getElementById("BasicTaskButton") as HTMLButtonElement;
        basicTaskButton.addEventListener('click', function () {
            cleanPopup();
            createBasicForm();
        })

        const projectButton = document.getElementById("ProjectButton") as HTMLButtonElement;
        projectButton.addEventListener('click', function () {
            toastr.info("Not implemented");
            //TODO: implement
        })

        showPopup();
    })


}

function createBasicForm() {
    const container = document.getElementById("popupContainer") as HTMLDivElement;
    container.innerHTML =
        "<div id='formHolder'><div id='inputBlock'>" +
        "<label class='inputLabel' for='nameInput'>Name</label><input id='nameInput' minlength='5' maxlength='30'>" +
        "<label class='inputLabel' for='descriptionInput'>Description</label><textarea id='descriptionInput' maxlength='300'></textarea>" +
        "</div></div>";

    const form = document.getElementById("inputBlock") as HTMLDivElement;
    form.appendChild(createBasicSaveButton());
    form.appendChild(createCancelButton());
}

function createCancelButton(): HTMLButtonElement {
    const cancelButton = document.createElement("button");
    cancelButton.id = "cancelButton";
    cancelButton.addEventListener('click', cancelLogic);
    cancelButton.textContent = "Cancel";
    return cancelButton;
}

function createBasicSaveButton(): HTMLButtonElement {
    const saveButton: HTMLButtonElement = document.createElement("button");
    saveButton.id = "saveButton";
    saveButton.type = "button";
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', saveBasicLogic)
    return saveButton;
}

function showPopup() {
    const window = document.getElementById("popupWindow") as HTMLDivElement;
    window.style.display = "flex";
}

function hidePopup() {
    const window = document.getElementById("popupWindow") as HTMLDivElement;
    window.style.display = "none";
}

function cleanPopup() {
    const container = document.getElementById("popupContainer") as HTMLDivElement;
    container.innerHTML = "";
}

function loadTasks() {
    fetch("/task/basic/getAll", {
        method: "GET",
        credentials: "include"
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            toastr.error("Status: " + response.status);
            return null;
        }
    }).then(json => {
        json.forEach((task: TaskDTO) => {
            addBasicTask(task.id, task.name, task.description);
        })
    })
}

function addBasicTask(taskId: string, taskName: string, taskDescription: string): void {
    const container = document.getElementById("taskContainer") as HTMLDivElement;

    const taskDiv = document.createElement("div");
    taskDiv.id = "task_" + taskId;
    taskDiv.className = "task";

    const name = document.createElement("p");
    name.id = "name_" + taskId;
    name.className = "taskName";
    name.textContent = taskName;

    const nameLabel: HTMLLabelElement = document.createElement("label");
    nameLabel.htmlFor = "name_" + taskId;


    const description = document.createElement("p");
    description.id = "description_" + taskId;
    description.className = "taskDescription";
    description.textContent = taskDescription;

    const descriptionLabel: HTMLLabelElement = document.createElement("label");
    descriptionLabel.htmlFor = "description_" + taskId;

    taskDiv.innerHTML = '<button class="editTaskButton"><img src="img/three-dots-vertical.svg" alt="ED"></button>';
    taskDiv.appendChild(name);
    taskDiv.appendChild(nameLabel);
    taskDiv.appendChild(description);
    taskDiv.appendChild(descriptionLabel);
    container.appendChild(taskDiv);
}

function cancelLogic() {
    hidePopup();
    cleanPopup();
}

async function saveBasicLogic() {
    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const descriptionInput = document.getElementById("descriptionInput") as HTMLTextAreaElement;

    let name = nameInput.value;
    let description = descriptionInput.value;

    if (name.includes("\t") || name.includes("\n")) {
        toastr.error("Name can`t include new lines or tabs");
        return;
    } else if (name.length < 6 || name.length > 30) {
        toastr.error("Name length should be 6-30 symbols, your is " + name.length);
        return;
    } else if (description.length > 300) {
        toastr.error("Max description length 300, your is " + description.length);
        return;
    }

    if (description.length == 0) {
        description = "No description";
    }

    await fetch("/task/basic/create", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "name": name,
            "description": description
        })
    }).then(response => {
        const status = response.status;
        if (status === 201) {
            return response.json();
        } else {
            throw Error("Status: " + status);
        }
    }).then(data => {
        hidePopup();
        cleanPopup();
        addBasicTask(data.id, data.name, data.description);
    })
}


interface TaskDTO {
    id: string,
    name: string,
    description: string,
    created: any,
    updated: any
}