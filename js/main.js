const items = document.querySelectorAll('.toolbar-item');
const indicator = document.querySelector('.indicator');
const searchBar = document.querySelector('.search-bar');

let lastIndex = 0; 

function moveIndicator(element) {
  const itemWidth = element.offsetWidth;
  const itemLeft = element.offsetLeft;
  const indicatorWidth = indicator.offsetWidth;

  const left = itemLeft + (itemWidth / 2) - (indicatorWidth / 2);
  indicator.style.left = `${left}px`;
}

moveIndicator(items[0]);

items.forEach((item, index) => {
  item.addEventListener('click', () => {
    moveIndicator(item);

    searchBar.classList.remove("active-left", "active-right", "exit-left", "exit-right");

    const isSearch = item.querySelector("i").classList.contains("fa-search");
    const wasSearch = items[lastIndex].querySelector("i").classList.contains("fa-search");

    if (isSearch) {
      if (lastIndex < index) {
        searchBar.classList.add("active-left"); 
      } else {
        searchBar.classList.add("active-right"); 
      }
    } else if (wasSearch) {
      if (index > lastIndex) {
        searchBar.classList.add("exit-left"); 
      } else {
        searchBar.classList.add("exit-right"); 
      }
    }

    lastIndex = index;
  });
});

window.addEventListener("resize", () => {
  const activeItem = document.querySelector(".toolbar-item.active");
  if (activeItem) {
    moveIndicator(activeItem);
  }
});
