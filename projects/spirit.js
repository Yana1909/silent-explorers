/* A video project: all the logic lives in _video.js (see the usage note there). */
(function(){
  if (!window.createVideoProject) return;
  window.createVideoProject({
    id: "spirit",
    title: { en: "Spirit's Diary", uk: "Щоденник Spirit" },
    src: "assets/video/spirit.mp4",
    poster: "assets/video/spirit.jpg",
    alt: { en: "A toy-like model of the Spirit rover standing on the open pages of a diary", uk: "Модель марсохода Spirit на розкритих сторінках щоденника" },
    note: { en: "AI-generated animation based on real mission facts", uk: "Анімація створена ШІ за реальними фактами місії" }
  });
})();
