console.log("Let's write javascript");

let currentSong = new Audio();
let songs = [];
let currFolder = "";

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ✅ Load songs from playlist.json
async function getSongs(folder) {
    currFolder = folder;
    const res = await fetch(`/songs/${folder}/playlist.json`);
    songs = await res.json();
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/songs/${currFolder}/${track.file}`;

    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg";
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track.title);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

    const songUl = document.querySelector(".song-list ul");
    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `
            <li>  
                <img src="/img/music.svg" alt="music icon">
                <div class="info">
                    <div>${song.title}</div>
                    <div>Mahir</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img src="/img/player.svg" alt="play icon">
                </div>
            </li>`;
    }

    Array.from(songUl.children).forEach((li, index) => {
        li.addEventListener("click", () => {
            playMusic(songs[index]);
        });
    });
};

// ✅ Display albums using local folders + info.json
async function displayAlbums() {
    const albums = [
        "cs", // Add more folders as needed
        "rockstar",
        "classic"
    ];

    for (const folder of albums) {
        try {
            const res = await fetch(`/songs/${folder}/info.json`);
            const info = await res.json();
            document.querySelector(".cardsContainer").innerHTML += `
                <div data-folder="${folder}" class="cards">
                    <div class="play">
                        <img style="width: 48px" src="/img/play.svg" alt="Play" />
                    </div>
                    <img class="song-img" src="/songs/${folder}/cover.jpg" alt="">
                    <h2 class="singer-h-t">${info.title}</h2>
                    <div class="content">
                        <p class="singer-p-t">${info.description}</p>
                    </div>
                </div>`;
        } catch (err) {
            console.error(`Failed to load album ${folder}`, err);
        }
    }

    document.querySelectorAll(".cards").forEach(card => {
        card.addEventListener("click", async () => {
            const folder = card.dataset.folder;
            await getSongs(folder);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    await getSongs("cs");
    playMusic(songs[0], true);

    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "/img/player.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = (e.offsetX / e.target.clientWidth);
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = `${percent * 100}%`;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        const index = songs.findIndex(s => s.file === currentSong.src.split("/").pop());
        if (index > 0) playMusic(songs[index - 1]);
    });

    next.addEventListener("click", () => {
        const index = songs.findIndex(s => s.file === currentSong.src.split("/").pop());
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    document.querySelector(".range input").addEventListener("input", e => {
        const vol = e.target.value;
        currentSong.volume = vol / 100;
        document.querySelector(".volume > img").src = vol > 0 ? "/img/sound.svg" : "/img/mute.svg";
    });

    document.querySelector(".volume > img").addEventListener("click", e => {
        if (e.target.src.includes("sound.svg")) {
            e.target.src = "/img/mute.svg";
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = "/img/sound.svg";
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });
}

main();
