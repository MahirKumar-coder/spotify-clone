console.log("Welcome")


async function getSong() {
    let a = await fetch("http://192.168.1.8:3000/songs/")
    let response = await a.text();
    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div);
    let as = div.getElementsByTagName("a");
    let songs = [];
    console.log(as);
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

async function main() {
    let songs = await getSong();
    console.log(songs);

    const songUl = document.querySelector(".song-list").getElementsByTagName("ul");
    for (const song of songs) {
        
    }
}
main();