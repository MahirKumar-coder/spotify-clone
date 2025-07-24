console.log("Let's write javascript")
let currentSong = new Audio();
let songs
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    seconds = Math.floor(seconds); // Remove decimal part
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}



async function getSongs(folder) {

    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg";
    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `
            <li>  
                <img src="/img/music.svg" alt="music icon">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Mahir</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img src="/img/player.svg" alt="play icon">
                </div>
            </li>`;
    }

    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
};


async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardsContainer = document.querySelector(".cardsContainer");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardsContainer.innerHTML = cardsContainer.innerHTML + `<div data-folder="${folder}" class="cards">
                        <div class="play">
    <img style width="48px" src="img/play.svg" alt="Play" />
</div>

                        <img class="song-img" src="/songs/${folder}/cover.jpg" alt="">
                        <h2 class="singer-h-t">${response.title}</h2>
                        <div class="content">
                            <p class="singer-p-t">${response.description}</p>
                        </div>
                    </div>`
        }
    }

    Array.from(document.querySelectorAll(".cards")).forEach(card => {
        card.addEventListener("click", async () => {
            let folder = card.dataset.folder;
            console.log("Clicked on card with folder:", folder);
            await getSongs(`songs/${folder}`);
            playMusic(songs[0]); // Load and play first song in that album (paused)
        });
    });
}

async function main() {

    await getSongs("songs/cs");
    playMusic(songs[0], true);

    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/player.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentage + "%";
        currentSong.currentTime = ((currentSong.duration) * percentage) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    previous.addEventListener("click", () => {
        console.log("Clicked on Previous");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        }

    })

    next.addEventListener("click", () => {
        console.log("Clicked on Next");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to ", e.target.value, " /100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0){
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("img/mute.svg", "img/sound.svg");
        }
    })

    document.querySelector(".volume > img").addEventListener("click", e => {

        if (e.target.src.includes("img/sound.svg")) {
            e.target.src = e.target.src.replace("img/sound.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/sound.svg");
            currentSong.volume = 0.1; // or restore to previous level if you store it
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });


}

main();
