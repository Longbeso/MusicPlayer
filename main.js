let cd = document.querySelector(".cd");
const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const player = document.querySelector(".player");
const playBtn = document.querySelector(".btn-toggle-play");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const randomBtn = document.querySelector(".btn-random");
const playList = document.querySelector(".playlist");
const repeatBtn = document.querySelector(".btn-repeat");
const progress = document.querySelector(".progress");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // dùng this trỏ tới object thì dùng function bình thường
  linkApi:
    "https://raw.githubusercontent.com/Longbeso/MusicPlayer/refs/heads/useMockApi/data/music.json",

  Songs: [],
  getData: async function () {
    let response = await fetch(this.linkApi);
    let songs = await response.json();
    app.Songs = [...songs];
  },
  render: (Songs) => {
    let htmls = Songs.map((song, index) => {
      return `
        <div class="song ${index === app.currentIndex ? "active" : ""}">
            <div
              class="thumb"
              style="
              background-image: url('${song.image}');
            "
            ></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.Songs[this.currentIndex];
      },
    });
  },

  // những hàm xử lý event sẽ nằm trong đây
  handleEvents: () => {
    const listSongs = document.querySelectorAll(".song");
    console.log(listSongs);
    // xử lý CD  rotate adn pause nếu dùng css thì mỗi khi bấm dừng nó lại quay cái ảnh về lúc ban đầu

    let cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý phóng to cd thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      const opacityCd = newWidth / cdWidth;
      cd.style.width = newWidth > 5 ? newWidth + "px" : 0 + "px";
      cd.style.opacity = opacityCd;
    });
    // xử lý play / pause
    playBtn.addEventListener("click", () => {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    // không nhất thiết khi bấm nút play thì mới play nên mới tách ra , khi audio được play ở chỗ khác thì vẫn chuyển đổi nút được

    // khi song được play
    audio.addEventListener("play", () => {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    });

    // khi song bị pause
    audio.addEventListener("pause", () => {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    });

    // thanh range chạy
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        let percentTime = (audio.currentTime / audio.duration) * 100;
        progress.value = percentTime;
      }
    });

    // khi thay đổi thanh range (thanh thời gian bài hát )
    progress.addEventListener("input", () => {
      let current = (progress.value / 100) * audio.duration;
      audio.currentTime = current;
      audio.play();
    });

    // code test
    // progress.addEventListener("mousedown", () => {
    //   isSeeking = true; // đang kéo
    // });

    // progress.addEventListener("mouseup", () => {
    //   isSeeking = false; // thả chuột xong
    // });

    // next song

    nextBtn.addEventListener("click", () => {
      const currentActive = document.querySelector(".song.active");
      currentActive.classList.remove("active");
      if (app.isRandom) {
        app.playRandomSong();
        listSongs[app.currentIndex].classList.add("active"); // add active cho bài hát đang phát
      } else {
        app.nextSong();
        listSongs[app.currentIndex].classList.add("active");
      }
      audio.play();
    });

    // prevSong
    prevBtn.addEventListener("click", () => {
      const currentActive = document.querySelector(".song.active");
      currentActive.classList.remove("active");

      if (app.isRandom) {
        app.playRandomSong();
        listSongs[app.currentIndex].classList.add("active");
      } else {
        app.prevSong();
        listSongs[app.currentIndex].classList.add("active");
      }
      audio.play();
    });

    // random
    randomBtn.addEventListener("click", () => {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
      // nếu isRandom == true thì add ngược lại remove
    });

    // bấm vào bài hát ở playList và play
    listSongs.forEach((song, index) => {
      song.addEventListener("click", () => {
        const currentActive = document.querySelector(".song.active");
        currentActive.classList.remove("active");
        app.currentIndex = index;
        song.classList.add("active");
        app.loadCurrentSong();
        audio.play();
      });
    });
    // repeat khi hết bài
    repeatBtn.addEventListener("click", () => {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    });
    // khi hết bài thì next
    audio.addEventListener("ended", () => {
      if (app.isRepeat) {
        audio.play();
      } else {
        if (app.isRandom) {
          app.playRandomSong();
        } else {
          app.nextSong();
        }
        audio.play();
      }
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.Songs[this.currentIndex].path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.Songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    console.log(this.currentIndex);
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.Songs.length - 1;
    }
    this.loadCurrentSong();
    console.log(this.currentIndex);
  },
  playRandomSong: function () {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * app.Songs.length);
    } while (randomIndex === app.currentIndex);
    app.currentIndex = randomIndex;
    this.loadCurrentSong();
    audio.play();
  },
  start: async function () {
    await this.getData();

    // định nghĩa thuộc tính cho app
    app.defineProperties();

    // tải thông tin của bài hát đầu tiên
    app.loadCurrentSong();

    app.render(app.Songs);
    app.handleEvents();
    // tải thông tin bài hát đầu tiên vào UI(user interface)
  },
};

app.start();
