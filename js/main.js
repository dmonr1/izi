const items = document.querySelectorAll(".toolbar-item");
const indicator = document.querySelector(".indicator");
const searchBar = document.querySelector(".search-bar");
const panels = document.querySelectorAll(".panel");

let lastIndex = 0;

function moveIndicator(element) {
    const left = element.offsetLeft + element.offsetWidth / 2 - indicator.offsetWidth / 2;
    indicator.style.left = `${left}px`;
}

function showPanel(panelClass) {
    panels.forEach(panel => {
        panel.classList.remove("show");
    });
    const panel = document.querySelector(`.${panelClass}`);
    if (panel) panel.classList.add("show");
}


function showPanel(panelClass, comingFromLeft) {
    panels.forEach(panel => {
        panel.classList.remove("show", "active-left", "active-right", "exit-left", "exit-right");
    });

    const panel = document.querySelector(`.${panelClass}`);
    if (panel) {
        // Si entro al panel-search → animación de entrada
        if (panelClass === "panel-search") {
            panel.classList.add(comingFromLeft ? "active-right" : "active-left");
        }
        panel.classList.add("show");
    }
}


items.forEach((item, index) => {
    item.addEventListener("click", () => {
        moveIndicator(item);

        const panelName = item.dataset.panel;
        const comingFromLeft = lastIndex < index;

        // 🔹 Limpiamos las clases de animación previas
        searchBar.classList.remove("active-left", "active-right", "exit-left", "exit-right");

        if (panelName === "panel-search") {
            // 🔹 Si ENTRO al search → animación de entrada
            searchBar.classList.add(comingFromLeft ? "active-left" : "active-right");

        } else if (items[lastIndex].dataset.panel === "panel-search") {
            // 🔹 SOLO si el panel anterior era "panel-search" → animación de salida
            searchBar.classList.add(comingFromLeft ? "exit-left" : "exit-right");
        }

        showPanel(panelName);
        lastIndex = index;
    });
});



moveIndicator(items[0]);
showPanel("panel-home");

window.addEventListener("resize", () => {
    const activeItem = document.querySelector(".toolbar-item.active");
    if (activeItem) {
        moveIndicator(activeItem);
    }
});
