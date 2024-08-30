declare var toastr: Toastr;

//this file already looks like shit :|
//TODO: refactor
document.addEventListener("DOMContentLoaded", async function () {
    initScrollButtons();
    setupPopupWindow();
    initHeaderButtons();
    loadTasks();
});


function initHeaderButtons() {
    setupAddButton();
    setupLogoutButton();
    setupMultipleDeleteButton();
}

function setupMultipleDeleteButton() {
    const deleteButton = document.getElementById("delete") as HTMLButtonElement;
    deleteButton.addEventListener('click', function () {
        const menu = document.getElementById("deleteMenuContainer");
        if (menu == null) {
            addTaskSelectListeners();
            createDeleteMenu();
        }
    })
}

function createDeleteMenu() {
    const main = document.getElementById("mainContainer") as HTMLDivElement;
    const container = document.createElement("div");
    container.id = "deleteMenuContainer";

    container.appendChild(createDeleteButton());
    container.appendChild(createCancelButton());
    container.appendChild(createSelectAllButton());
    container.appendChild(createUnselectAllButton());

    const draggable = createDraggableContainer("deleteDragContainer");
    draggable.appendChild(container);
    draggable.style.top = "200px";
    draggable.style.left = "1000px";
    main.appendChild(draggable);
    dragElement(draggable);

    function createDeleteButton(): HTMLButtonElement {
        const deleteButton = document.createElement("button");
        deleteButton.id = "deleteButton";
        deleteButton.className = "deleteMenuButtons";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', function () {
            const selectedTasks = document.querySelectorAll('.selected');
            let ids: Array<string> = [];
            selectedTasks.forEach(task => {
                ids.push(task.id.substring(5));
            })
            deleteTasks(ids);
        });
        return deleteButton;
    }

    function createCancelButton() {
        const cancel = document.createElement("button");
        cancel.id = "cancelDeletionButton";
        cancel.className = "deleteMenuButtons";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", function () {
            removeHTMLElement("deleteDragContainer");
            unselectAllTasks();
            removeTaskSelectListeners();
            addTaskOpenListeners();
        });
        return cancel;
    }

    function createSelectAllButton() {
        const selectAll = document.createElement("button");
        selectAll.textContent = "All";
        selectAll.className = "deleteMenuButtons"
        selectAll.addEventListener('click', selectAllTasks);
        return selectAll;
    }

    function createUnselectAllButton() {
        const unselectAll = document.createElement("button");
        unselectAll.textContent = "None";
        unselectAll.className = "deleteMenuButtons"
        unselectAll.addEventListener('click', unselectAllTasks);
        return unselectAll;
    }
}

function selectAllTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        if (!task.classList.contains("selected")) {
            task.classList.add('selected');
        }
    })
}

function unselectAllTasks() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        if (task.classList.contains("selected")) {
            task.classList.remove('selected');
        }
    })
}

//Call dragElement() after appending it
function createDraggableContainer(containerId: string): HTMLDivElement {
    const draggableContainer = document.createElement("div");
    draggableContainer.id = containerId;
    draggableContainer.className = "draggableContainer";

    const containerHeader = document.createElement("div");
    containerHeader.id = containerId + "Header";
    containerHeader.className = "draggableHeader";

    draggableContainer.appendChild(containerHeader);
    return draggableContainer;
}

//if it works, don`t touch it
function dragElement(element: HTMLDivElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "Header")) {
        const container = document.getElementById(element.id + "Header") as HTMLDivElement;
        container.onmousedown = dragMouseDown;
    } else {
        element.onmousedown = dragMouseDown;
    }

    //@ts-ignore
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    //@ts-ignore
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function removeHTMLElement(elId: string) {
    const el = document.getElementById(elId) as HTMLElement;
    el.remove();
}

function addTaskSelectListeners() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        // @ts-ignore
        task.addEventListener('click', addToggleSelected);
    })
}

function removeTaskSelectListeners() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        // @ts-ignore
        task.removeEventListener('click', addToggleSelected);
    })
}

function addToggleSelected(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.toggle('selected');
}

function addTaskOpenListeners() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.addEventListener('click', function () {
            //TODO: add open task function
        })
    })
}

async function deleteTasks(ids: Array<string>) {
    await fetch("/task/basic/multiple-delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(ids)
    }).then(async response => {
        const status = response.status;
        if (status === 200) {
            loadTasks();
            return;
        } else {
            toastr.info("Status" + status)
        }
    }).catch(error => {
        toastr.error("Error: " + error.getMessage());
        toastr.error("Error: " + error);
    });
}

function setupLogoutButton() {
    const button = document.getElementById("exit") as HTMLButtonElement;
    button.addEventListener('click', function () {
        const container = document.getElementById("logoutContainer");
        if (container == null) {
            createLogoutMenu();
        } else {
            container.remove();
        }
    });
}

function createLogoutMenu() {
    const container = document.createElement("div");
    container.id = "logoutContainer";

    const logoutHere = document.createElement("button");
    logoutHere.id = "logoutHere";
    logoutHere.className = "logoutButtons";
    logoutHere.textContent = "Logout this device";
    logoutHere.addEventListener("click", async function () {
        await logout("/auth/logout-here");
        window.location.href = "/login";
    });

    const logoutAll = document.createElement("button");
    logoutAll.id = "logoutAll";
    logoutAll.className = "logoutButtons";
    logoutAll.textContent = "Logout everywhere";
    logoutAll.addEventListener("click", async function () {
        await logout("/auth/logout-all");
        window.location.href = "/login";
    });

    container.appendChild(logoutHere);
    container.appendChild(logoutAll);

    const button = document.getElementById("exit") as HTMLButtonElement;
    const rect = button.getBoundingClientRect();

    container.style.left = `${rect.left}px`;
    container.style.top = `${rect.bottom + 5}px`;

    const main = document.getElementById("mainContainer") as HTMLDivElement;
    main.appendChild(container);
}

async function logout(link: string) {
    await fetch(link, {
        method: "POST",
        credentials: "include"
    })
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
        "<label class='inputLabel' for='descriptionInput'>Description</label><textarea id='descriptionInput' maxlength='250'></textarea>" +
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
    const container = document.getElementById("taskContainer") as HTMLDivElement;
    container.innerHTML = "";
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
