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
                "VeLDÁ": "linear-gradient(135deg, rgba(125, 238, 125, 0.6), rgba(58, 233, 58, 0.4))",
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

            document.querySelector('.music-img').src = img;
            document.querySelector('.music-title').innerText = title;
            document.querySelector('.music-artist-top').innerText = artist;
            document.querySelector('.music-artist').innerText = artist;

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

document.addEventListener("DOMContentLoaded", () => {
    const cardPlay = document.getElementById("cardPlay");
    const controlPlay = document.getElementById("controlPlay");

    let isPlaying = false;

    function togglePlay() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            cardPlay.classList.remove("fa-play");
            cardPlay.classList.add("fa-pause");

            controlPlay.classList.remove("fa-circle-play");
            controlPlay.classList.add("fa-circle-pause");
        } else {
            cardPlay.classList.remove("fa-pause");
            cardPlay.classList.add("fa-play");

            controlPlay.classList.remove("fa-circle-pause");
            controlPlay.classList.add("fa-circle-play");
        }
    }

    cardPlay.addEventListener("click", togglePlay);
    controlPlay.addEventListener("click", togglePlay);
});

const playBtn = document.getElementById("cardPlay");

playBtn.addEventListener("click", () => {
    if (playBtn.classList.contains("fa-play")) {
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
    } else {
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
    }

    playBtn.classList.remove("show");
    void playBtn.offsetWidth;
    playBtn.classList.add("show");
});

const audio = document.getElementById("audioPlayer");
const cardPlay = document.getElementById("cardPlay");
const controlPlay = document.getElementById("controlPlay");

let isPlaying = false;
let fadeInterval = null;

const musicFiles = {
    "velda": "../assets/music/velda.mp3",
    "Abrazame": "../assets/music/abrazame.mp3",
    "Coqueta": "../assets/music/coqueta.mp3",
    "Heaven": "../assets/music/heaven.mp3",
    "Incondicional": "../assets/music/incondicional.mp3"
};

window.addEventListener("DOMContentLoaded", () => {
    audio.src = musicFiles["Coqueta"];
    audio.currentTime = 0;
    isPlaying = false;
    updateIcons();
});

function changeSong(title) {
    const newSrc = musicFiles[title];
    if (!newSrc) return;

    fadeOut(() => {
        audio.src = newSrc;
        audio.currentTime = 0;
        audio.volume = 0;
        audio.play().then(() => fadeIn());
        isPlaying = true;
        updateIcons();
    });
}

function fadeIn() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + 0.05, 1);
        } else {
            clearInterval(fadeInterval);
        }
    }, 60);
}

function fadeOut(callback) {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume = Math.max(audio.volume - 0.05, 0);
        } else {
            clearInterval(fadeInterval);
            audio.pause();
            if (callback) callback();
        }
    }, 60);
}

function updateIcons() {
    if (isPlaying) {
        cardPlay.classList.remove("fa-play");
        cardPlay.classList.add("fa-pause");

        controlPlay.classList.remove("fa-circle-play");
        controlPlay.classList.add("fa-circle-pause");
    } else {
        cardPlay.classList.remove("fa-pause");
        cardPlay.classList.add("fa-play");

        controlPlay.classList.remove("fa-circle-pause");
        controlPlay.classList.add("fa-circle-play");
    }
}

function togglePlay() {
    if (!audio.src) return;

    if (isPlaying) {
        isPlaying = false;
        fadeOut();
    } else {
        isPlaying = true;
        audio.play();
        fadeIn();
    }
    updateIcons();
}

cardPlay.addEventListener("click", togglePlay);
controlPlay.addEventListener("click", togglePlay);

document.querySelectorAll('.song-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').innerText;
        changeSong(title);
    });
});


const progressBar = document.getElementById("progressBar");

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

progressBar.parentElement.addEventListener("click", (e) => {
    const rect = progressBar.parentElement.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
});

function changeSong(index, direction = "next") {
    const song = songs[index];
    if (!song) return;

    fadeOut(() => {
        audio.src = song.file;
        audio.currentTime = 0;
        audio.play().then(() => fadeIn());

        // Actualizar portada y textos
        imgEl.src = song.img;
        nowImg.src = song.img;

        titleEl.textContent = song.title;
        nowTitle.textContent = song.title;

        artistEl.textContent = song.artist;
        artistTopEl.textContent = song.artist;
        nowArtist.textContent = song.artist;
    });
}

const progressBarCard = document.getElementById("progressBarCard");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBarCard.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

document.querySelector(".progress-container-card").addEventListener("click", (e) => {
    const containerWidth = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const newTime = (clickX / containerWidth) * audio.duration;
    audio.currentTime = newTime;
});

const songTitles = Object.keys(musicFiles);
let currentSongIndex = songTitles.indexOf("Coqueta"); 

const imgEl = document.querySelector(".music-img");
const titleEl = document.querySelector(".music-title");
const artistEl = document.querySelector(".music-artist");
const artistTopEl = document.querySelector(".music-artist-top");

const nowImg = document.querySelector(".now-playing-img");
const nowTitle = document.querySelector(".now-playing-info h4");
const nowArtist = document.querySelector(".now-playing-info p");

function changeSong(title, direction = "next") {
    const newSrc = musicFiles[title];
    if (!newSrc) return;

    imgEl.classList.add(direction === "next" ? "slide-out-left" : "slide-out-right");
    nowImg.classList.add(direction === "next" ? "slide-out-left" : "slide-out-right");

    setTimeout(() => {
        audio.src = newSrc;
        audio.currentTime = 0;
        audio.play();

        imgEl.src = `../assets/images/${title.toLowerCase()}.png`;
        nowImg.src = `../assets/images/${title.toLowerCase()}.png`;

        titleEl.textContent = title;
        nowTitle.textContent = title;

        const artist = musicArtists[title] || "Desconocido";
        artistEl.textContent = artist;
        artistTopEl.textContent = artist;
        nowArtist.textContent = artist;

        imgEl.classList.remove("slide-out-left", "slide-out-right");
        nowImg.classList.remove("slide-out-left", "slide-out-right");

        imgEl.classList.add(direction === "next" ? "slide-in-right" : "slide-in-left");
        nowImg.classList.add(direction === "next" ? "slide-in-right" : "slide-in-left");

        setTimeout(() => {
            imgEl.classList.remove("slide-in-right", "slide-in-left");
            nowImg.classList.remove("slide-in-right", "slide-in-left");
        }, 400);
    }, 400);
}


document.querySelector(".fa-forward-step").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex + 1) % songTitles.length;
    changeSong(songTitles[currentSongIndex], "next");
});

document.querySelector(".fa-backward-step").addEventListener("click", () => {
    currentSongIndex = (currentSongIndex - 1 + songTitles.length) % songTitles.length;
    changeSong(songTitles[currentSongIndex], "prev");
});


const musicArtists = {
    "VeLDÁ": "Bad Bunny",
    "Abrazame": "Juan Gabriel",
    "Coqueta": "Grupo Frontera",
    "Heaven": "Bryan Adams",
    "Incondicional": "Prince Royce"
};