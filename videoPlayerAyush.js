function initVideoPlayer(config) {

 //I took help from mdn https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

  let video;
  if (typeof config.videoElement === "string") {
    video = document.querySelector(config.videoElement);
  } else {
    video = config.videoElement;
  }
  if (!video) {
    return;
  }

  let container;
  if (config.container) {
    container = document.querySelector(config.container);
  } else {
    container = video.parentElement;
  }

  const controlsConfig = config.controls || {};
  const defaults = config.defaults || {};

  video.controls = false;

  let isSeeking = false;
  let lastVolume;
  if (defaults.volume != null) {
    lastVolume = defaults.volume;
  } else {
    lastVolume = 1;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2,"0")}`;
  }

  const controls = document.createElement("div");
  controls.className = "custom-controls";
  
  var html = "";
  html += `<button class="play-pause">Play</button>`;
  html += `<span class="time current">00:00</span>`;
  html += `<input type="range" class="progress" min="0" max="100" value="0">`;
  html += `<span class="time duration">00:00</span>`;

  if (controlsConfig.volume !== false) {
    html += `<button class="mute">Mute</button>`;
    html += `<input type="range" class="volume" min="0" max="1" step="0.01">`;
  }

  if (controlsConfig.playbackSpeed !== false) {
    html += `<select class="speed">`;
    html += `<option value="0.5">0.5x</option>`;
    html += `<option value="1">1x</option>`;
    html += `<option value="1.25">1.25x</option>`;
    html += `<option value="1.5">1.5x</option>`;
    html += `<option value="2">2x</option>`;
    html += `</select>`;
  }

  if (controlsConfig.fullscreen !== false) {
    html += `<button class="fullscreen">Fullscreen</button>`;
  }

  controls.innerHTML = html; 

  container.appendChild(controls);

  const playPauseButton = controls.querySelector(".play-pause");
  const progress = controls.querySelector(".progress");
  const currentTimeVideo = controls.querySelector(".current");
  const durationVideo = controls.querySelector(".duration");
  const volumeSlider = controls.querySelector(".volume");
  const muteButton = controls.querySelector(".mute");
  const speedSelect = controls.querySelector(".speed");
  const fullScreenButton = controls.querySelector(".fullscreen");

//default setting
  if (volumeSlider && defaults.volume != null) {
    video.volume = defaults.volume;
    volumeSlider.value = defaults.volume;
  }

  if (speedSelect && defaults.speed != null) {
    video.playbackRate = defaults.speed;
    speedSelect.value = defaults.speed;
  }

//disable controls until metadata is loaded
  var elements = controls.querySelectorAll("button, input, select");
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }

  video.addEventListener("loadedmetadata", () => {
    durationVideo.textContent = formatTime(video.duration);
    var elems = controls.querySelectorAll("button, input, select");
    for (var i = 0; i < elems.length; i++) {
      elems[i].disabled = false;
    }
  });

// play/pause button
  playPauseButton.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {
    playPauseButton.textContent = "Pause";
  });

  video.addEventListener("pause", () => {
    playPauseButton.textContent = "Play";
  });

//seeking
  video.addEventListener("timeupdate", () => {
    if (!isSeeking) {
      progress.value = (video.currentTime / video.duration) * 100;
      currentTimeVideo.textContent = formatTime(video.currentTime);
    }
  });

  progress.addEventListener("input", () => {
    isSeeking = true;
  });

  progress.addEventListener("change", () => {
    video.currentTime = (progress.value / 100) * video.duration;
    isSeeking = false;
  });

//volume
  if (volumeSlider && muteButton) {
    volumeSlider.addEventListener("input", () => {
      video.volume = volumeSlider.value;
      video.muted = false;
    });

    muteButton.addEventListener("click", () => {
      if (video.muted) {
        video.muted = false;
        video.volume = lastVolume;
        volumeSlider.value = lastVolume;
        muteButton.textContent = "Mute";
      } else {
        lastVolume = video.volume;
        video.muted = true;
        volumeSlider.value = 0;
        muteButton.textContent = "Unmute";
      }
    });
  }

//playback speed
  if (speedSelect) {
    speedSelect.addEventListener("change", () => {
      video.playbackRate = speedSelect.value;
    });
  }

//fullscreen
  if (fullScreenButton) {
    fullScreenButton.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        fullScreenButton.textContent = "Exit Fullscreen";
      } else {
        fullScreenButton.textContent = "Fullscreen";
      }
    });
  }
}
