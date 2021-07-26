console.log('ok');
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlistContainer = $('[data-playlist-container]');
const songTemplate = $('#song_template');
const cdContainer = $('[data-cd-container]');
const cdWidth = cdContainer.offsetWidth;
const dashboardContainer = $('[data-dashboard-container]');

const playAndPauseBtn = $('[data-play-pause-button]');
const audio = $('[data-audio]');

const nextBtn = $('[data-next-button]');
const prevBtn = $('[data-prev-button]');
const repeatBtn = $('[data-repeat-button]');
const randomBtn = $('[data-random-button]');
const currentSongTitle = $('[data-current-song-title]');
const cdImage = $('[data-cd-img]');

const progress = $('[data-progress]');
const currentSongTime = $('[data-current-song-time]');
const playSongTime = $('[data-song-time-play]');


const volumeBtn = $('[data-volume-button]');
const volumeInput = $('[data-volume-input]');

const LOCAL_STORATE_MUSIC_PLAYER_KEY = 'music.key';

const keyCurrent = JSON.parse(localStorage.getItem(LOCAL_STORATE_MUSIC_PLAYER_KEY))

let currentIndex = (keyCurrent) ? keyCurrent.currentIndex : 0;
let isPlaying = false;
let isReapeat = (keyCurrent) ? keyCurrent.isReapeat : false;
let isRandom = (keyCurrent) ? keyCurrent.isRandom : false;

const cdThumbAnimate = cdContainer.animate([
    // keyframes
    {transform: 'rotate(360deg)'}
  ], {
    // timing options
    duration: 10000,
    iterations: Infinity
});
cdThumbAnimate.pause();

let lists = [
    {
        name: 'Tháng năm',
        singer: 'Soobin Hoàng Sơn',
        path: './asset/music/thang-nam.mp3',
        image: './asset/music_thumb/soobin_thang_nam.jpg',
        time: '03:01'
    },
    {
        name: 'Lạc trôi',
        singer: 'Sơn Tùng',
        path: './asset/music/lac-troi.mp3',
        image: './asset/music_thumb/sontung_lactroi.jpg',
        time: '04:20'
    },
    {
        name: 'Nơi tình yêu bắt đầu',
        singer: 'Bùi Anh Tuấn',
        path: './asset/music/noi-tinh-yeu-bat-dau.mp3',
        image: './asset/music_thumb/buianhtuan_noi_tinh_yeu_bat_dau3.jpg',
        time: '02:14'
    },
    {
        name: 'Em ngày xưa khác rồi',
        singer: 'Hiền Hồ',
        path: './asset/music/em-ngay-xua-khac-roi.mp3',
        image: './asset/music_thumb/hienho_em-ngay-xua-khac-roi.jpg',
        time: '04:47'
    },
    {
        name: 'Ngốc',
        singer: 'Hương Tràm',
        path: './asset/music/ngoc.mp3',
        image: './asset/music_thumb/huongtram_ngoc2.jpg',
        time: '04:52'
    },
    {
        name: 'Gặp nhưng không ở lại',
        singer: 'Hiền Hồ',
        path: './asset/music/gap-nhung-khong-o-lai.mp3',
        image: './asset/music_thumb/hienho_gap-nhung-khong-o-lai.jpg',
        time: '04:36'
    },
    {
        name: 'Nơi này có anh',
        singer: 'Sơn Tùng MTP',
        path: './asset/music/noi-nay-co-anh.mp3',
        image: './asset/music_thumb/sontung_noi_nay_co_anh.jpg',
        time: '04:17'
    },
    {
        name: 'Em nhớ anh',
        singer: 'Miu Lê',
        path: './asset/music/em-nho-anh.mp3',
        image: './asset/music_thumb/miule.jpg',
        time: '03:45'
    },
]

function render() {
    clearElement(playlistContainer);
    lists.forEach((song,index) => {
        const songElement = document.importNode(songTemplate.content, true);
        const songContainer = songElement.querySelector('.song');
        const songThumb = songElement.querySelector('[data-song-thumb]');
        const songTitle = songElement.querySelector('.song__body .title');
        const songAuthor = songElement.querySelector('.song__body .author');
        const songTime = songElement.querySelector('.song__body .time');
        songContainer.dataset.index = index;
        songTitle.innerText = song.name;
        songAuthor.innerText = song.singer;
        songTime.innerText = song.time;
        songThumb.style.backgroundImage = `url('${song.image}')`;

        playlistContainer.appendChild(songElement);

    });

    if(isReapeat == true) {
        repeatBtn.classList.add('active');
        randomBtn.classList.remove('active');
        if(isRandom == true) isRandom = false
    }
    else {
        repeatBtn.classList.remove('active');
    }

    if(isRandom == true) {
        randomBtn.classList.add('active');
        repeatBtn.classList.remove('active');
        if(isReapeat == true) isReapeat = false
    }
    else {
        randomBtn.classList.remove('active');
    }

    loadCurrentSong(currentIndex);
}
function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
render();

function saveToLocalStorage() {
    let key = {
        currentIndex: currentIndex,
        isReapeat: isReapeat,
        isRandom: isRandom
    }
    localStorage.setItem(LOCAL_STORATE_MUSIC_PLAYER_KEY, JSON.stringify(key));
}

document.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const cdNewWidth = cdWidth - scrollTop;
    cdContainer.style.width = (cdNewWidth > 0) ? cdNewWidth + 'px': 0;
    cdContainer.style.opacity = cdNewWidth / cdWidth;
})
playAndPauseBtn.addEventListener('click', function() {
    if(isPlaying) {
        audio.pause();
    }
    else{
        audio.play();
    }
})
const playBtn = $('[data-play-button]');
const pauseBtn = $('[data-pause-button]');
audio.onplay = function() {
    isPlaying = true;
    cdThumbAnimate.play();
    pauseBtn.classList.add('active');
    playBtn.classList.add('active');
}
audio.onpause = function() {
    isPlaying = false;
    cdThumbAnimate.pause()
    pauseBtn.classList.remove('active');
    playBtn.classList.remove('active')
}
function loadCurrentSong(currentIndex) {
    currentSongTitle.innerText = lists[currentIndex].name;
    cdImage.style.backgroundImage = `url('${lists[currentIndex].image}')`;
    audio.src = `${lists[currentIndex].path}`;
    audio.play();
    dashboardContainer.style.backgroundImage = `url('${lists[currentIndex].image}')`;
    saveToLocalStorage();
    findSongPlay(currentIndex)
}
function formatTime(time) {
    var mins = Math.floor(time / 60);
    if (mins < 10) {
      mins = '0' + String(mins);
    }
    var secs = Math.floor(time % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    return mins + ':' + secs;
}
    

nextBtn.addEventListener('click', function() {
    if(isReapeat) {
        currentIndex = currentIndex;
    }
    else if(isRandom) {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * lists.length);
        }
        while(newIndex === currentIndex);
        currentIndex = newIndex;
    }
    else {
        currentIndex++;
        if(currentIndex >= lists.length) currentIndex = 0;
    }
    loadCurrentSong(currentIndex);
    
})

prevBtn.addEventListener('click', function() {
    if(isReapeat) {
        currentIndex = currentIndex;
    }
    else if(isRandom) {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * lists.length);
        }
        while(newIndex === currentIndex);
        currentIndex = newIndex;
    }
    else {
        currentIndex--;
        if(currentIndex < 0) currentIndex = lists.length - 1;
    }
    loadCurrentSong(currentIndex);
})

repeatBtn.addEventListener('click', function() {
    isReapeat = !isReapeat;
    if(isReapeat == true) {
        repeatBtn.classList.add('active');
        randomBtn.classList.remove('active');
        if(isRandom == true) isRandom = false
    }
    else {
        repeatBtn.classList.remove('active');
    }
    saveToLocalStorage();
})
randomBtn.addEventListener('click', function() {
    isRandom = !isRandom;
    if(isRandom == true) {
        randomBtn.classList.add('active');
        repeatBtn.classList.remove('active');
        if(isReapeat == true) isReapeat = false
    }
    else {
        randomBtn.classList.remove('active');
    }
    saveToLocalStorage()
})

audio.onended = function() {
    if(isReapeat) {
        currentIndex = currentIndex;
    }
    else if(isRandom) {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * lists.length);
        }
        while(newIndex === currentIndex);
        currentIndex = newIndex;
    }
    else {
        currentIndex++;
        if(currentIndex >= lists.length) currentIndex = 0;
    }
    loadCurrentSong(currentIndex);
}
audio.ontimeupdate = function() {
    var songTime = audio.duration;
    let currentTime = audio.currentTime;
    progress.value = currentTime * 100 / songTime;

    playSongTime.innerText = formatTime(audio.currentTime);
}
audio.ondurationchange = function() {
    currentSongTime.innerText = formatTime(audio.duration);
}
progress.oninput = function() {
    var songTime = audio.duration;
    let currentTime = songTime / 100 * progress.value;
    audio.currentTime = currentTime;
    progress.value = currentTime * 100 / songTime;
}

volumeBtn.addEventListener('click', function() {
    volumeInput.classList.toggle('active');
})
volumeInput.value = audio.volume * 10;
volumeInput.oninput = function() {
    audio.volume = volumeInput.value / 10;
}
playlistContainer.addEventListener('click', function(e) {
    const playBtn = e.target.closest('.song__play');
    if(playBtn) {
        const songId = e.target.closest('.song').dataset.index;
        loadCurrentSong(songId);
        setTimeout(function() {
            e.target.closest('.song').scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
        }, 3000)
    }
})

function findSongPlay(currentIndex) {
    if($('.song.active')) {
        $('.song.active').classList.remove('active');
    }
    const songsLists = $$('.song');
    songsLists.forEach(function(song) {
        if(song.getAttribute('data-index') == currentIndex) {
            song.classList.add('active')
        }
    })
    
}




