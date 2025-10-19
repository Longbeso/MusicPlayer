const app = {
  songs: [
    {
      id: 0,
      name: "Mơ hồ",
      singer: "Bùi Anh Tuấn",
      path: "./music/1.mp3",
      image: "./img/img1.jpg",
    },
    {
      id: 1,
      name: "Nơi tình yêu bắt đầu",
      singer: "Bùi Anh Tuấn",
      path: "./music/2.mp3",
      image: "./img/img2.jpg",
    },
    {
      id: 2,
      name: "Nơi tình yêu kết thúc",
      singer: "Bùi Anh Tuấn",
      path: "./music/3.mp3",
      image: "./img/img3.jpg",
    },
    {
      id: 3,
      name: "Phố không mùa",
      singer: "Bùi Anh Tuấn",
      path: "./music/4.mp3",
      image: "./img/img4.jpg",
    },
    {
      id: 4,
      name: "Thuận theo ý trời",
      singer: "Bùi Anh Tuấn",
      path: "./music/5.mp3",
      image: "./img/img5.jpg",
    },
    {
      id: 5,
      name: "Slatt on",
      singer: "Robber",
      path: "./music/6.mp3",
      image: "./img/img6.jpg",
    },
    {
      id: 6,
      name: "Chất lượng lên",
      singer: "ICD",
      path: "./music/7.mp3",
      image: "./img/img7.jpg",
    },
  ],
  render: () => {
    let playList = document.querySelector(".playlist");
    let htmls = app.songs.map((song) => {
      return `
        <div class="song">
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
  // những hàm xử lý event sẽ nằm trong đây
  handleEvents: () => {
    let cd = document.querySelector(".cd");
    const cdWidth = cd.offsetWidth;

    document.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      const opacityCd = newWidth / cdWidth;
      cd.style.width = newWidth > 5 ? newWidth + "px" : 0 + "px";
      cd.style.opacity = opacityCd;
    });

    // test trình phát nhạc
    const player = document.querySelector(".player");
    const listSongs = document.querySelectorAll(".song");
    const audioPlay = document.querySelector("#audio");
    const buttonPlay = document.querySelector(".btn-toggle-play");
    const cdThumb = cd.querySelector(".cd-thumb");
    const nameSongNow = document.querySelector(".songName");
    const btnPrev = document.querySelector(".btn-prev");
    const btnNext = document.querySelector(".btn-next");
    // cd xoay
    cdRotate = () => {
      cdThumb.classList.add("songRotate");
    };
    cdUnRotate = () => {
      cdThumb.classList.remove("songRotate");
    };
    // control

    playMusic = () => {
      audioPlay.play();
      player.classList.add("playing");
      cdRotate();
    };
    pauseMusic = () => {
      audioPlay.pause();
      player.classList.remove("playing");
      cdUnRotate();
    };

    // play
    buttonPlay.addEventListener("click", () => {
      if (audioPlay.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });

    playNewMusic = (index) => {
      audioPlay.src = app.songs[index].path;
      cdThumb.style.backgroundImage = `url(${app.songs[index].image})`;
      nameSongNow.innerHTML = app.songs[index].name;
      playMusic();
    };

    listSongs.forEach((song, index) => {
      song.addEventListener("click", () => {
        playNewMusic(index);
      });
    });

    // range
    const process = document.querySelector(".progress");
    // nút trượt theo nhạc
    audioPlay.addEventListener("timeupdate", () => {
      const percent = 100 * (audioPlay.currentTime / audioPlay.duration);
      process.value = percent;
      if (audioPlay.currentTime == audioPlay.duration) {
        cdUnRotate();
      }
    });

    // xả nhạc
    process.addEventListener("input", () => {
      // range nó tính trên thang 100 còn thời gian của nhạc có thể nhiều hơn nên phải chia tỷ lệ
      let percent = (process.value / 100) * audioPlay.duration;
      audioPlay.currentTime = percent;
      if (audioPlay.paused) {
        playMusic();
      }
    });
    // repeat
    const repeatBtn = document.querySelector(".btn-repeat");
    repeatBtn.addEventListener("click", () => {
      audioPlay.currentTime = 0;
      cdUnRotate();
      setTimeout(() => {
        playMusic();
      }, 500);
    });
    // next and prev
    btnPrev.addEventListener("click", () => {
      const nameSongNow2 = document.querySelector(".songName");

      const obj = app.songs.find(
        (item) => item.name === nameSongNow2.innerText
      );
      let idSong = obj ? obj.id - 1 : null;
      console.log(idSong);
      if (idSong < 0) {
        idSong = 0;
      }

      playNewMusic(idSong);
    });
    btnNext.addEventListener("click", () => {
      const nameSongNow2 = document.querySelector(".songName");

      const obj = app.songs.find(
        (item) => item.name === nameSongNow2.innerText
      );
      let idSong = obj ? obj.id + 1 : null;
      console.log(idSong);
      if (idSong > app.songs.length - 1) {
        idSong = app.songs.length - 1;
      }

      playNewMusic(idSong);
    });

    // random
    let btnRandom = document.querySelector(".btn-random");
    btnRandom.addEventListener("click", () => {
      playNewMusic(Math.floor(Math.random() * app.songs.length));
    });
  },
  start: () => {
    app.render();
    app.handleEvents();
  },
};

app.start();
