// ============================
//  VARIABLES GLOBALES
// ============================
const items = document.querySelectorAll(".toolbar-item");
const indicator = document.querySelector(".indicator");
const searchBar = document.querySelector(".search-bar");
const panels = document.querySelectorAll(".panel");

const nowCard = document.querySelector(".now-playing-card");
const audio = document.getElementById("audioPlayer");

const cardPlay = document.getElementById("cardPlay");
const controlPlay = document.getElementById("controlPlay");

const progressBar = document.getElementById("progressBar");
const progressBarCard = document.getElementById("progressBarCard");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");

const imgEl = document.querySelector(".music-img");
const titleEl = document.querySelector(".music-title");
const artistEl = document.querySelector(".music-artist");
const artistTopEl = document.querySelector(".music-artist-top");

const nowImg = document.querySelector(".now-playing-img");
const nowTitle = document.querySelector(".now-playing-info h4");
const nowArtist = document.querySelector(".now-playing-info p");

// ============================
// DATA
// ============================

const musicFiles = {
  velda: "../assets/music/velda.mp3",
  topdiesel: "../assets/music/top-diesel.mp3",
  abrazame: "../assets/music/abrazame.mp3",
  coqueta: "../assets/music/coqueta.mp3",
  heaven: "../assets/music/heaven.mp3",
  pillara: "../assets/music/si-te-pillara.mp3",
  incondicional: "../assets/music/incondicional.mp3",
};

const musicArtists = {
  velda: "Bad Bunny",
  topdiesel: "Beéle",
  abrazame: "Juan Gabriel",
  coqueta: "Grupo Frontera",
  heaven: "Bryan Adams",
  pillara: "Beéle",
  incondicional: "Prince Royce",
};

// ============================
//  ESTADO
// ============================
let isPlaying = false;
let fadeInterval = null;

const songTitles = Object.keys(musicFiles);
let currentSongIndex = songTitles.indexOf("Coqueta");
let lastIndex = 0;

// ============================
//  FUNCIONES AUXILIARES
// ============================
function moveIndicator(element) {
  const left =
    element.offsetLeft + element.offsetWidth / 2 - indicator.offsetWidth / 2;
  indicator.style.left = `${left}px`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// ============================
//  REPRODUCCIÓN
// ============================
function fadeIn() {
  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(audio.volume + 0.05, 1);
    } else clearInterval(fadeInterval);
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
    cardPlay.classList.replace("fa-play", "fa-pause");
    controlPlay.classList.replace("fa-circle-play", "fa-circle-pause");
  } else {
    cardPlay.classList.replace("fa-pause", "fa-play");
    controlPlay.classList.replace("fa-circle-pause", "fa-circle-play");
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

function changeSong(key, direction = "next") {
  const newSrc = musicFiles[key];
  if (!newSrc) return;

  imgEl.classList.add(
    direction === "next" ? "slide-out-left" : "slide-out-right"
  );
  nowImg.classList.add(
    direction === "next" ? "slide-out-left" : "slide-out-right"
  );

  setTimeout(() => {
    audio.src = newSrc;
    audio.currentTime = 0;

    isPlaying = true;
    audio.play();
    fadeIn();
    updateIcons();

    imgEl.src = `../assets/images/${key}.png`;
    nowImg.src = `../assets/images/${key}.png`;

    const titleFormatted = cardTitleFormat(key);
    titleEl.textContent = titleFormatted;
    nowTitle.textContent = titleFormatted;

    const artist = musicArtists[key] || "Desconocido";
    artistEl.textContent = artist;
    artistTopEl.textContent = artist;
    nowArtist.textContent = artist;

    imgEl.classList.remove("slide-out-left", "slide-out-right");
    nowImg.classList.remove("slide-out-left", "slide-out-right");

    imgEl.classList.add(
      direction === "next" ? "slide-in-right" : "slide-in-left"
    );
    nowImg.classList.add(
      direction === "next" ? "slide-in-right" : "slide-in-left"
    );

    setTimeout(() => {
      imgEl.classList.remove("slide-in-right", "slide-in-left");
      nowImg.classList.remove("slide-in-right", "slide-in-left");
    }, 400);
  }, 400);
}

function cardTitleFormat(key) {
  const titles = {
    velda: "VeLDÁ",
    topdiesel: "Top Diesel",
    abrazame: "Abrazame muy fuerte",
    coqueta: "Coqueta",
    heaven: "Heaven",
    incondicional: "Incondicional",
  };
  return titles[key] || key;
}

// ============================
//  AUTO-PLAY SIGUIENTE CANCIÓN
// ============================
audio.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songTitles.length;
  changeSong(songTitles[currentSongIndex], "next");
});

// ============================
//  EVENTOS UI
// ============================
cardPlay.addEventListener("click", togglePlay);
controlPlay.addEventListener("click", togglePlay);

document.querySelector(".fa-forward-step").addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songTitles.length;
  changeSong(songTitles[currentSongIndex], "next");
});

document.querySelector(".fa-backward-step").addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + songTitles.length) % songTitles.length;
  changeSong(songTitles[currentSongIndex], "prev");
});

document.querySelectorAll(".song-card").forEach((card) => {
  card.addEventListener("click", () => {
    const songKey = card.dataset.song; // <-- clave segura del data-song
    changeSong(songKey);
  });
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressBarCard.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

progressBar.parentElement.addEventListener("click", (e) => {
  const rect = progressBar.parentElement.getBoundingClientRect();
  const newTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  audio.currentTime = newTime;
});

document
  .querySelector(".progress-container-card")
  .addEventListener("click", (e) => {
    const width = e.currentTarget.clientWidth;
    const newTime = (e.offsetX / width) * audio.duration;
    audio.currentTime = newTime;
  });

// ============================
//  TOOLBAR Y PANELES
// ============================
function showPanel(panelClass, comingFromLeft) {
  panels.forEach((panel) =>
    panel.classList.remove(
      "show",
      "active-left",
      "active-right",
      "exit-left",
      "exit-right"
    )
  );

  const panel = document.querySelector(`.${panelClass}`);
  if (panel) {
    panel.classList.add(comingFromLeft ? "active-right" : "active-left");
    panel.classList.add("show");
  }

  if (panelClass === "panel-music") {
    nowCard.classList.remove("show");
    nowCard.classList.add("hide");
  } else {
    nowCard.classList.remove("hide");
    nowCard.classList.add("show");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  moveIndicator(items[0]);
  showPanel("panel-home");

  audio.src = musicFiles["Coqueta"];
  audio.currentTime = 0;
  isPlaying = false;
  updateIcons();

  nowCard.classList.add("show");
});

items.forEach((item, index) => {
  item.addEventListener("click", () => {
    moveIndicator(item);

    const panelName = item.dataset.panel;
    const comingFromLeft = lastIndex < index;

    searchBar.classList.remove(
      "active-left",
      "active-right",
      "exit-left",
      "exit-right"
    );

    if (panelName === "panel-search") {
      searchBar.classList.add(comingFromLeft ? "active-right" : "active-left");
    } else if (items[lastIndex].dataset.panel === "panel-search") {
      searchBar.classList.add(comingFromLeft ? "exit-left" : "exit-right");
    }

    showPanel(panelName, comingFromLeft);
    lastIndex = index;
  });
});

// ============================
//  INICIO
// ============================
window.addEventListener("DOMContentLoaded", () => {
  moveIndicator(items[0]);
  showPanel("panel-home");

  audio.src = musicFiles["Coqueta"];
  audio.currentTime = 0;
  isPlaying = false;
  updateIcons();

  nowCard.classList.add("show");
});

window.addEventListener("resize", () => {
  const activeItem = document.querySelector(".toolbar-item.active");
  if (activeItem) moveIndicator(activeItem);
});

// ============================
//  DROPDOWN
// ============================

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

document.addEventListener("click", function (event) {
  const profileBlock = document.querySelector(".profile-block");
  const dropdown = document.getElementById("dropdownMenu");
  if (!profileBlock.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});
