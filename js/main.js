const items = document.querySelectorAll(".toolbar-item");
const indicator = document.querySelector(".indicator");
const searchBar = document.querySelector(".search-bar");
const panels = document.querySelectorAll(".panel");

let lastIndex = 0;

function moveIndicator(element){
    const left = element.offsetLeft + element.offsetWidth/2 - indicator.offsetWidth/2;
    indicator.style.left = `${left}px`;
}

function showPanel(panelClass){
    panels.forEach(panel=>{
        panel.classList.remove("show");
    });
    const panel = document.querySelector(`.${panelClass}`);
    if(panel) panel.classList.add("show");
}

items.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        // Mover indicador
        moveIndicator(item);

        // Activar/Desactivar search bar
        searchBar.classList.remove("active-left","active-right","exit-left","exit-right");
        const panelName = item.dataset.panel;
        const comingFromLeft = lastIndex < index;

        if(panelName === "panel-search"){
            searchBar.classList.add(comingFromLeft ? "active-left":"active-right");
        } else if(searchBar.offsetParent !== null){
            searchBar.classList.add(comingFromLeft ? "exit-left":"exit-right");
        }

        // Mostrar el panel correspondiente
        showPanel(panelName);

        // Actualizar lastIndex
        lastIndex = index;
    });
});

// Inicial
moveIndicator(items[0]);
showPanel("panel-home");

window.addEventListener("resize", () => {
    const activeItem = document.querySelector(".toolbar-item.active");
    if (activeItem) {
        moveIndicator(activeItem);
    }
});
