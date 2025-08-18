const items = document.querySelectorAll('.toolbar-item');
const indicator = document.querySelector('.indicator');

function moveIndicator(element) {
  const itemWidth = element.offsetWidth;
  const itemLeft = element.offsetLeft;
  const indicatorWidth = indicator.offsetWidth;

  // Lo centramos en el ítem
  const left = itemLeft + (itemWidth / 2) - (indicatorWidth / 2);
  indicator.style.left = `${left}px`;
}

// Inicializar en el primero
moveIndicator(items[0]);

items.forEach(item => {
  item.addEventListener('click', () => moveIndicator(item));
});
