/*
  TEMPLATE for a student project drawn on a <canvas>: an animation or a mini-game.
  (Got a finished MP4 instead? You don't need this file — see "I have a finished
  MP4" in README.md.)

  How to use it:
    1. Copy this file and name the copy after your location id,
       for example projects/spirit.js. The list of ids is in README.md.
    2. Write the same id into LOCATION_ID below. While it is empty,
       this file does nothing at all.
    3. Fill in title, author and type, then draw your scene in draw().
    4. Ask a mentor to add  <script src="projects/<your id>.js"></script>
       to index.html, next to the other project scripts.

  The contract (the same for every project):
    window.STUDENT_PROJECTS[<location id>] = {
      title, author, type: "animation" | "game" | "video",
      init(container, item) { ...; return cleanup; }
    };
  `container` is an empty box, about 16:10, already sized by the page.
  `item` is the machine's record (item.name, item.facts, ...), if you need it.
  init() MUST return a cleanup() function that stops everything you started.
*/
(function(){
  var LOCATION_ID = "";          // <-- your location id, e.g. "spirit"
  if (!LOCATION_ID) return;      // nothing is registered until you fill it in

  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS[LOCATION_ID] = {
    title: "My project",         // <-- short name of your project
    author: "Your name",         // <-- your name
    type: "animation",           // <-- "animation" or "game"
    init: function(container, item){
      // ---------- canvas that always fills the box ----------
      var canvas = document.createElement("canvas");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);
      var ctx = canvas.getContext("2d");

      function resize(){
        var r = container.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, r.width * dpr);
        canvas.height = Math.max(1, r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // after this, draw in CSS pixels
      }
      resize();
      var ro = new ResizeObserver(resize);
      ro.observe(container);

      // ---------- your state ----------
      var x = 0;                 // example: something that moves
      var pressed = false;       // example: input for a game

      // ---------- input (for a game; delete if you only animate) ----------
      // Every listener you add here must be removed in cleanup() below.
      function onDown(e){ e.preventDefault(); pressed = true; }
      function onUp(){ pressed = false; }
      canvas.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);

      // ---------- the loop ----------
      var raf = 0, running = true, last = performance.now();

      function draw(now){
        if (!running) return;
        var dt = Math.min((now - last) / 1000, 0.1); // seconds since the last frame
        last = now;
        var w = container.clientWidth, h = container.clientHeight;

        // update: move things by speed * dt, so the speed is the same on any screen
        x = (x + (pressed ? 240 : 80) * dt) % (w + 40);

        // draw: clear, then paint the frame
        ctx.fillStyle = "#0b1020";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#62e6c4";
        ctx.fillRect(x - 40, h * 0.5 - 10, 40, 20);

        raf = requestAnimationFrame(draw);
      }
      raf = requestAnimationFrame(draw);

      // ---------- cleanup: runs when the card closes or another one opens ----------
      // Stop the loop, timers and sounds, and remove every listener you added.
      return function cleanup(){
        running = false;
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        // clearInterval(...) / clearTimeout(...) / audio.pause() go here too
      };
    }
  };
})();
