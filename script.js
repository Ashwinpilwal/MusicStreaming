console.log("JavaScript is Here")
let currentSong = new Audio;
let songs;
let currfolder;
let folder;

function formatTime(seconds) {
    // Calculate whole minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Use padStart to ensure the minutes and seconds are always 2 digits (e.g., 01, 02, ..., 59)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine formatted minutes and seconds into the desired format "mm:ss"
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

    return formattedTime;
}


async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}`)
    // let a = await fetch("http://192.168.36.112:3000/songs/")


    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    console.log("as is :",as)
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href);
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs)
    //Show all the songs from the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        // a = song.replace("(getmp3.pro).mp3", " ")
        let a = song
        a = a.replaceAll("%20", " ")

        // songUL.innerHTML += `<li>${song.replace("(getmp3.pro).mp3", " ")}</li>`;

        songUL.innerHTML += `<li><img src="music.svg" alt="">
                            <div class="info">
                                <div>${a.replaceAll("_", " ")}</div>
                                <div>Ashwin</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`;

        // songUL.innerHTML = songUL.innerHTML + song;
    }

    // Attach an Event Listener to Play Each Song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    })

}

const playmusic = (track, pause = false) => {


    // currentSong.src = "/songs/" + track.replaceAll(" ","_") //----->> To Play Non Working Songs
    // currentSong.src = `/songs/${currfolder}` + track.replaceAll(" ","_") //----->> To Play Non Working Songs
    // currentSong.src = `/${currfolder}/` + track.replaceAll(" ","_") //----->> To Play Non Working Songs

    console.log(currentSong.src)
    // audio.play()


    currentSong.src = `/${currfolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    // currentSong.play() 


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00 : 00"
}

async function main() {


    // Get The List of all The songs 

    // songs = await getsongs("songs/ncs");  ===================================================> WHY THE FUCK THIS IS NOT WORKING
    await getsongs("songs/ncs");
    // console.log(songs);
    playmusic(songs[0], true)


    // Displaying All The Albums On The Page

    let a = await fetch(`/songs/`)
    // let a = await fetch("http://192.168.36.112:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    // console.log(anchors)
    // Array.from(anchors).forEach(async e=>{     // We will Not use For each Because It is requires a Async Function And Its time LIke a promise --> Undefined
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("songs/") && !e.href.includes(".htaccess")) {
        // if (e.href.includes("songs/")) {

            // console.log(e.href.split("/").slice(4)[0])    // [0] --> This is remove the bracket.
            folder = e.href.split("/").slice(4)[0]   // [0] --> This is remove the bracket.
            //  Get The Meta Data Of The Folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            console.log(response)
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="#000000">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.png" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }




    }



    // Attach an Event Listener to Play, Previous, Next 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }


    })



    // Play the First Song 
    // var audio = new Audio(songs[0]);
    // // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(duration)
    // })

    // Attach an Event Listener For Time Update
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an event Listener To Seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e)
        // console.log(e.target.getBoundingClientRect(),e.offsetX)

        // console.log((e.offsetX/e.target.getBoundingClientRect().width)*100)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        // document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%"
        document.querySelector(".circle").style.left = percent + "%"

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    // Add an event listener for Hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = 0 + "%"
    })


    // Add an event listener for Close
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = -120 + "%"
    })



    // Add an event Listener for previous and next
    previous.addEventListener("click", () => {
        console.log("Previous Clicked")

        let index = songs.indexOf(currentSong.src.split("/")[5])
        // console.log(currentSong.src.split("/") [5])
        // console.log(index)
        // console.log(songs, index)

        if ((index + 1) > 0) {
            playmusic(songs[index - 1])
        }


    })
    // Add an event Listener for previous and next
    next.addEventListener("click", () => {
        console.log("Next Clicked")

        let index = songs.indexOf(currentSong.src.split("/")[5])
        // console.log(currentSong.src.split("/") [5])
        // console.log(index)
        // console.log(songs, index)

        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }


    })

    // Add an Event Listener For Volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)

        currentSong.volume = parseInt(e.target.value) / 100

    })

    // Load Playlist WHen ever Card Is Clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {

            // songs = await getsongs("songs/ncs");
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            // songs = await getsongs(`songs/${folder}`);
        })
    })

    // Add Event Listener to Mute the Track
    // document.querySelector(".volume>img").addEventListener("click", e => {    // ----------------------->> BY ME
    //     console.log(e.target.src)
    //     if (e.target.src == "http://127.0.0.1:5500/volume.svg") {
    //         e.target.src = "http://127.0.0.1:5500/mute.svg"
    //         currentSong.volume = 0
    //         document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    //     }
    //     else {
        //         e.target.src = "http://127.0.0.1:5500/volume.svg"
        //         currentSong.volume = .40
        //         document.querySelector(".range").getElementsByTagName("input")[0].value = 40
        //     }
        
        document.querySelector(".volume>img").addEventListener("click",e=>{    // -------------------------->> BY HARRY
            console.log(e.target.src)
            if(e.target.src.includes("volume.svg")){
                e.target.src = e.target.src.replace("volume.svg","mute.svg")
                currentSong.volume = 0
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0
            }
            else{
                e.target.src = e.target.src.replace("mute.svg","volume.svg")
                currentSong.volume = .40
                document.querySelector(".range").getElementsByTagName("input")[0].value = 40
            }

        }


    )
}

    main()