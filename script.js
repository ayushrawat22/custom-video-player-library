document.addEventListener("DOMContentLoaded", () => {
  initVideoPlayer({
    videoElement: "#guitarVideo",
    container: ".video-wrapper",
    controls: {
      volume: true,
      fullscreen: true,
      playbackSpeed: true
    },
    defaults: {
      volume: 0.8,
      speed: 1
    }
  });
});
