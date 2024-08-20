declare var toastr: Toastr;

document.addEventListener("DOMContentLoaded", async function () {
    initScrollButtons();




});

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

