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
        panel.classList.add(comingFromLeft ? "active-right" : "active-left");
        panel.classList.add("show");
    }
}

items.forEach((item, index) => {
    item.addEventListener("click", () => {
        moveIndicator(item);

        const panelName = item.dataset.panel;
        const comingFromLeft = lastIndex < index;

        searchBar.classList.remove("active-left", "active-right", "exit-left", "exit-right");

        if (panelName === "panel-search") {
            searchBar.classList.add(comingFromLeft ? "active-right" : "active-left");

        } else if (items[lastIndex].dataset.panel === "panel-search") {
            searchBar.classList.add(comingFromLeft ? "exit-left" : "exit-right");
        }

        showPanel(panelName, comingFromLeft);
        lastIndex = index;
    });
});

document.querySelectorAll('.close-icon').forEach(icon => {
    icon.addEventListener('click', function () {
        const card = this.closest('.song-card');
        card.classList.add('removing');
        setTimeout(() => {
            card.remove();
        }, 400);
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

document.querySelectorAll('.song-card').forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img').src;
        const title = card.querySelector('h3').innerText;
        const artist = card.querySelector('p').innerText;

        const nowImg = document.querySelector('.now-playing-img');
        const nowTitle = document.querySelector('.now-playing-info h4');
        const nowArtist = document.querySelector('.now-playing-info p');
        const nowCard = document.querySelector('.now-playing-card');

        [nowImg, nowTitle, nowArtist].forEach(el => el.classList.add('fade-out'));

        setTimeout(() => {
            nowImg.src = img;
            nowTitle.innerText = title;
            nowArtist.innerText = artist;

            const gradients = {
                "VeLDÁ": "linear-gradient(135deg, rgba(144, 238, 144, 0.6), rgba(50, 205, 50, 0.4))",
                "Abrazame": "linear-gradient(135deg, rgba(173, 216, 230, 0.4), rgba(135, 206, 250, 0.3))",
                "Coqueta": "linear-gradient(135deg, rgba(255, 0, 150, 0.2), rgba(0, 200, 255, 0.2))",
                "Heaven": "linear-gradient(135deg, rgba(220, 220, 220, 0.4), rgba(169, 169, 169, 0.3))",
                "Incondicional": "linear-gradient(135deg, rgba(123, 104, 238, 0.4), rgba(72, 61, 139, 0.3))"
            };

            nowCard.style.background = gradients[title] || "linear-gradient(135deg, #1d95b9, #003264)";

            [nowImg, nowTitle, nowArtist].forEach(el => {
                el.classList.remove('fade-out');
                el.classList.add('fade-in');
            });

            setTimeout(() => {
                [nowImg, nowTitle, nowArtist].forEach(el => el.classList.remove('fade-in'));
            }, 300);

        }, 300);
    });
});

const nowCard = document.querySelector('.now-playing-card');

window.addEventListener('DOMContentLoaded', () => {
    nowCard.classList.add('show');
});

document.querySelectorAll('.toolbar-item').forEach(item => {
    item.addEventListener('click', () => {
        const targetPanel = item.getAttribute('data-panel');

        if (targetPanel === 'panel-music') {
            nowCard.classList.remove('show');
            nowCard.classList.add('hide');
        } else {
            nowCard.classList.remove('hide');
            nowCard.classList.add('show');
        }
    });
});
