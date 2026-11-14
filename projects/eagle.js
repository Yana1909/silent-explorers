/* A video project: all the logic lives in _video.js (see the usage note there). */
(function(){
  if (!window.createVideoProject) return;
  window.createVideoProject({
    id: "eagle",
    title: { en: "The Last Minute of the Landing", uk: "Остання хвилина посадки" },
    src: "assets/video/eagle.mp4",
    poster: "assets/video/eagle.jpg",
    alt: { en: "Animated reconstruction of the Apollo 11 lunar module Eagle landing", uk: "Анімована реконструкція посадки місячного модуля «Орел» (Аполлон-11)" },
    note: { en: "Artist's reconstruction — not NASA footage", uk: "Художня реконструкція, а не відео NASA" }
  });
})();
