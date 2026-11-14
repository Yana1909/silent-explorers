/*
  Shared helper for student projects that are a ready-made MP4 clip.

  Usage (this is a whole project file, e.g. projects/<location id>.js):

    window.createVideoProject({
      id: "<location id>",                      // which marker the clip belongs to
      title: "Clip name",                       // a string, or { en: "...", uk: "..." }
      src: "assets/video/<location id>.mp4",    // H.264 + AAC, see README for the ffmpeg command
      poster: "assets/video/<location id>.jpg", // one frame of the clip, shown before playback
      note: "Artist's reconstruction — not NASA footage",  // honesty label, always shown (string or { en, uk })
      alt: "What the poster shows"              // optional description of the poster (string or { en, uk })
    });

  It registers a normal STUDENT_PROJECTS entry (see _template.js for the contract)
  with type "video". Nothing plays until the viewer presses the button; then
  the clip starts with sound. Portrait clips are shown whole, with a blurred
  copy of the poster filling the sides. Styles: css/styles.css, ".video-project".
  Load this file before any project file that calls it.

  Languages: title, note and alt may each be a plain string or an
  object { en: "...", uk: "..." } (resolved with window.pick). The texts of the
  button, the label and the error message come from the dictionary (window.t,
  js/i18n.js). When the language is switched while the clip is open, only these
  texts are replaced: the video keeps playing.
*/
(function(){
  // window.t / window.pick come from js/i18n.js; these fallbacks keep the helper usable without it
  function tr(key, params, fallback){ return window.t ? window.t(key, params) : fallback; }
  function pk(value){ return window.pick ? window.pick(value) : (value && typeof value === "object" ? (value.en || "") : value); }
  var PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>';

  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};

  window.createVideoProject = function(opts){
    if (!opts || !opts.id || !opts.src) return;

    window.STUDENT_PROJECTS[opts.id] = {
      title: opts.title || { en: "Video", uk: "Відео" },
      type: "video",
      init: function(container){
        container.innerHTML = "";

        var wrap = document.createElement("div");
        wrap.className = "video-project";

        // blurred, darkened poster behind the clip (instead of black bars)
        var backdrop = document.createElement("div");
        backdrop.className = "vp-backdrop";
        if (opts.poster) backdrop.style.backgroundImage = 'url("' + opts.poster + '")';
        wrap.appendChild(backdrop);

        var posterImg = null;
        if (opts.poster){
          posterImg = document.createElement("img");
          posterImg.className = "vp-poster";
          posterImg.alt = pk(opts.alt) || "";
          posterImg.src = opts.poster;
          wrap.appendChild(posterImg);
        }

        var video = document.createElement("video");
        video.className = "vp-video";
        video.preload = "metadata";
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.muted = false;
        video.controls = false; // native controls appear once the viewer starts the clip
        if (opts.poster) video.poster = opts.poster;
        wrap.appendChild(video);

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "vp-play";
        btn.innerHTML = PLAY_ICON;
        wrap.appendChild(btn);

        var noteEl = document.createElement("span");
        noteEl.className = "vp-note";
        wrap.appendChild(noteEl);

        container.appendChild(wrap);

        var alive = true;
        var msgEl = null;

        // every word on the clip's controls; called now and on each language switch (nothing is rebuilt)
        function setTexts(){
          var title = pk(opts.title) || tr("video.title", null, "Video");
          video.setAttribute("aria-label", tr("video.aria", { title: title }, title + " — student video"));
          btn.setAttribute("aria-label", tr("video.play", null, "Play video with sound"));
          noteEl.textContent = pk(opts.note) || tr("video.note", null, "Artist's reconstruction — not NASA footage");
          if (posterImg) posterImg.alt = pk(opts.alt) || "";
          if (msgEl) msgEl.textContent = tr("video.error", null, "This video could not be loaded");
        }
        setTexts();
        var offLang = window.onLangChange ? window.onLangChange(setTexts) : null;

        function showError(){
          if (!alive || wrap.classList.contains("failed")) return;
          wrap.classList.add("failed");
          wrap.classList.remove("playing");
          video.controls = false;
          btn.hidden = true;
          msgEl = document.createElement("span");
          msgEl.className = "vp-msg";
          msgEl.textContent = tr("video.error", null, "This video could not be loaded");
          wrap.appendChild(msgEl);
        }
        function onError(){ showError(); }
        function onPlaying(){ wrap.classList.add("playing"); }
        function onPlayClick(){
          if (wrap.classList.contains("failed")) return;
          btn.hidden = true;
          video.controls = true;
          video.muted = false;
          var p;
          try { p = video.play(); } catch(e){ showError(); return; }
          if (p && typeof p.then === "function"){
            p.then(function(){
              if (alive) { try { video.focus({ preventScroll:true }); } catch(e){ /* ignore */ } }
            }, function(){
              // refused or interrupted: put the button back unless the file itself failed
              if (!alive || wrap.classList.contains("failed")) return;
              if (video.error){ showError(); return; }
              video.controls = false;
              btn.hidden = false;
            });
          }
        }

        video.addEventListener("error", onError);
        video.addEventListener("playing", onPlaying);
        btn.addEventListener("click", onPlayClick);
        video.src = opts.src;

        return function cleanup(){
          alive = false;
          if (offLang) offLang();
          video.removeEventListener("error", onError);
          video.removeEventListener("playing", onPlaying);
          btn.removeEventListener("click", onPlayClick);
          try { video.pause(); } catch(e){ /* ignore */ }
          video.removeAttribute("src");
          try { video.load(); } catch(e){ /* ignore */ }
          if (video.parentNode) video.parentNode.removeChild(video);
          if (btn.parentNode) btn.parentNode.removeChild(btn);
          wrap.classList.remove("playing"); // the poster stays while the card slides away
        };
      }
    };
  };
})();
