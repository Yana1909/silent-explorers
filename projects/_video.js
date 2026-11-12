/*
  Shared helper for student projects that are a ready-made MP4 clip.

  Usage (this is a whole project file, e.g. projects/<location id>.js):

    window.createVideoProject({
      id: "<location id>",                      // which marker the clip belongs to
      title: "Clip name",
      author: "Your name",
      src: "assets/video/<location id>.mp4",    // H.264 + AAC, see README for the ffmpeg command
      poster: "assets/video/<location id>.jpg", // one frame of the clip, shown before playback
      note: "Artist's reconstruction — not NASA footage"   // honesty label, always shown
    });

  It registers a normal STUDENT_PROJECTS entry (see eagle.js for the contract)
  with type "video". Nothing plays until the viewer presses the button; then
  the clip starts with sound. Portrait clips are shown whole, with a blurred
  copy of the poster filling the sides. Styles: css/styles.css, ".video-project".
  Load this file before any project file that calls it.
*/
(function(){
  var DEFAULT_NOTE = "Artist's reconstruction — not NASA footage";
  var PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>';

  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};

  window.createVideoProject = function(opts){
    if (!opts || !opts.id || !opts.src) return;
    var note = opts.note || DEFAULT_NOTE;

    window.STUDENT_PROJECTS[opts.id] = {
      title: opts.title || "Video",
      author: opts.author || "",
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
          posterImg.alt = "";
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
        video.setAttribute("aria-label", (opts.title || "Video") + " — student video");
        wrap.appendChild(video);

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "vp-play";
        btn.setAttribute("aria-label", "Play video with sound");
        btn.innerHTML = PLAY_ICON;
        wrap.appendChild(btn);

        var noteEl = document.createElement("span");
        noteEl.className = "vp-note";
        noteEl.textContent = note;
        wrap.appendChild(noteEl);

        container.appendChild(wrap);

        var alive = true;

        function showError(){
          if (!alive || wrap.classList.contains("failed")) return;
          wrap.classList.add("failed");
          wrap.classList.remove("playing");
          video.controls = false;
          btn.hidden = true;
          var msg = document.createElement("span");
          msg.className = "vp-msg";
          msg.textContent = "This video could not be loaded";
          wrap.appendChild(msg);
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
