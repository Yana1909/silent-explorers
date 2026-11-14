/*
  Apollo 15 — "Moon Drive": a mini-game for the globe card "apollo15".
  Simplified game, not a simulation: the falling rocks are invented.
  Facts: NASA NSSDCA 1971-063C and the card's data.
*/
(function () {
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};

  var TXT = {
    title: { en: "Moon Drive", uk: "Поїздка по Місяцю" },
    introTitle: { en: "Drive the first Moon rover", uk: "Керуй першим місяцеходом" },
    intro: {
      en: "July 30, 1971: Falcon landed at the foot of the Apennines, and Scott and Irwin drove the first rover ever used on the Moon. Dodge the rocks and get back to Falcon: 1500 m.",
      uk: "30 липня 1971 року Falcon сів біля підніжжя Апеннін, а Скотт та Ірвін поїхали на першому в історії місячному ровері. Ухиляйся від каміння й доїдь до Falcon: 1500 м."
    },
    keys: {
      en: "Keyboard: A / D or ← / → steer, W faster, S brake, P pause. Touch: joystick, left/right steers, up is faster.",
      uk: "Клавіатура: A / D або ← / → кермо, W швидше, S гальмо, P пауза. Дотик: джойстик, вліво/вправо кермо, вгору швидше."
    },
    start: { en: "Start", uk: "Почати" },
    again: { en: "Play again", uk: "Грати знову" },
    resume: { en: "Resume", uk: "Продовжити" },
    pause: { en: "Pause", uk: "Пауза" },
    paused: { en: "Paused", uk: "Пауза" },
    fs: { en: "Fullscreen", uk: "На весь екран" },
    fsExit: { en: "Exit fullscreen", uk: "Вийти з повного екрана" },
    win: { en: "Back at Falcon!", uk: "Ти біля Falcon!" },
    lose: { en: "The wheel is damaged", uk: "Колесо пошкоджено" },
    driven: { en: "Driven", uk: "Проїхано" },
    best: { en: "Best", uk: "Рекорд" },
    real: {
      en: "In the real mission: 66 hours 55 minutes on the surface, 77.31 kg of rock and soil, and Scott's hammer and feather fell at the same rate in the lunar vacuum.",
      uk: "У справжній місії: 66 годин 55 хвилин на поверхні, 77,31 кг порід і ґрунту, а молоток і перо Скотта падали однаково в місячному вакуумі."
    },
    caption: {
      en: "Simplified game — not a simulation. The falling rocks are invented.",
      uk: "Спрощена гра, а не симуляція. Каміння, що летить, придумане."
    },
    hit: { en: "Rock hit! Lives left: ", uk: "Камінь! Залишилось життів: " },
    go: { en: "Drive started", uk: "Поїздку розпочато" },
    aria: { en: "Moon Drive mini-game", uk: "Міні-гра «Поїздка по Місяцю»" },
    joy: { en: "Joystick", uk: "Джойстик" },
    kmh: { en: "km/h", uk: "км/год" },
    m: { en: "m", uk: "м" }
  };
  function tx(k) {
    var v = TXT[k];
    if (window.pick) return window.pick(v);
    return (document.documentElement.lang || "uk").slice(0, 2) === "en" ? v.en : v.uk;
  }

  var STYLE =
    ".a15{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#05070f;outline:none;overflow:hidden;font-family:var(--font-body,system-ui,sans-serif);color:var(--ink,#f3f6ff);touch-action:none;user-select:none;-webkit-user-select:none}" +
    ".a15:focus-visible{box-shadow:inset 0 0 0 3px var(--focus,#fff)}" +
    ".a15.a15-pfs{position:fixed;inset:0;z-index:9999;width:100vw;height:100vh}" +
    ".a15-stage{position:relative}" +
    ".a15-stage canvas{width:100%;height:100%;display:block}" +
    ".a15-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:12px;text-align:center;background:rgba(7,11,24,.88);overflow:auto}" +
    ".a15-ov h3{margin:0;font-family:var(--font-display,inherit);font-size:clamp(13px,3vw,22px);color:var(--moon,#ecd292)}" +
    ".a15-ov p{margin:0;font-size:clamp(10px,2vw,14px);line-height:1.4;max-width:52ch;color:var(--ink-dim,#b9c3e2)}" +
    ".a15 button{min-width:44px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line,#34437a);background:rgba(18,27,53,.85);color:var(--ink,#f3f6ff);font:600 13px var(--font-body,system-ui,sans-serif);cursor:pointer}" +
    ".a15 button:focus-visible{outline:3px solid var(--focus,#fff);outline-offset:2px}" +
    ".a15 button.a15-main{background:var(--moon,#ecd292);color:var(--ink-on-accent,#0b1020);border-color:transparent}" +
    ".a15-tools{position:absolute;right:6px;bottom:20px;display:flex;gap:6px}" +
    ".a15-cap{position:absolute;left:0;right:0;bottom:3px;text-align:center;font-size:10px;color:rgba(243,246,255,.8);pointer-events:none;padding:0 6px}" +
    ".a15-joy{position:absolute;left:12px;bottom:22px;width:110px;height:110px;border-radius:50%;background:rgba(18,27,53,.55);border:2px solid var(--line,#34437a);display:none;touch-action:none}" +
    ".a15-joy.on{display:block}" +
    ".a15-knob{position:absolute;left:27px;top:27px;width:52px;height:52px;border-radius:50%;background:var(--moon,#ecd292);opacity:.85;pointer-events:none}" +
    ".a15-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}" +
    "@media (pointer:fine){.a15-joy{display:none!important}}";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  window.STUDENT_PROJECTS["apollo15"] = {
    title: TXT.title,
    type: "game",
    init: function (container) {
      container.innerHTML = "";
      var W = 800, H = 500, GOAL = 1500, CAR_Y = 410;
      var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      var rnd = Math.random;
      var cs = getComputedStyle(document.documentElement);
      function cv(name, fb) { return (cs.getPropertyValue(name) || "").trim() || fb; }
      var cMoon = cv("--moon", "#ecd292"), cSignal = cv("--signal", "#62e6c4");

      var style = document.createElement("style");
      style.textContent = STYLE;
      document.head.appendChild(style);

      // ---------- DOM ----------
      var wrap = el("div", "a15");
      wrap.tabIndex = 0;
      wrap.setAttribute("role", "group");
      var stage = el("div", "a15-stage");
      var canvas = el("canvas");
      canvas.setAttribute("aria-hidden", "true");
      var ctx = canvas.getContext("2d");
      var ov = el("div", "a15-ov");
      var cap = el("div", "a15-cap");
      var tools = el("div", "a15-tools");
      var btnPause = el("button");
      btnPause.type = "button";
      var btnFs = el("button");
      btnFs.type = "button";
      var joyEl = el("div", "a15-joy");
      var knob = el("div", "a15-knob");
      joyEl.appendChild(knob);
      var live = el("div", "a15-sr");
      live.setAttribute("aria-live", "polite");
      tools.appendChild(btnPause);
      tools.appendChild(btnFs);
      stage.appendChild(canvas);
      stage.appendChild(joyEl);
      stage.appendChild(tools);
      stage.appendChild(cap);
      stage.appendChild(ov);
      wrap.appendChild(stage);
      wrap.appendChild(live);
      container.appendChild(wrap);

      // ---------- state ----------
      var phase = "intro"; // intro | playing | paused | result
      var won = false, best = 0;
      try { best = +localStorage.getItem("a15best") || 0; } catch (e) {}
      var key = {}, joy = { x: 0, y: 0 };
      var car, lives, dist, thr, tt, inv, shake, spawnT, ws;

      // pools: no allocations inside the loop
      var craters = [], rocks = [], dust = [], i;
      var seed = mulberry32(15);
      for (i = 0; i < 12; i++) craters.push({ x: seed() * W, y: seed() * H, r: 12 + seed() * 38 });
      for (i = 0; i < 24; i++) {
        var shape = [];
        for (var s = 0; s < 8; s++) shape.push(0.75 + seed() * 0.4);
        rocks.push({ on: false, x: 0, y: 0, r: 0, vx: 0, vy: 0, a: 0, va: 0, shape: shape });
      }
      for (i = 0; i < 60; i++) dust.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, l: 0 });

      function say(msg) { live.textContent = msg; }
      function emitDust(x, y, n, spread) {
        for (var k = 0; k < dust.length && n > 0; k++) {
          var d = dust[k];
          if (d.on) continue;
          d.on = true; d.x = x; d.y = y; d.l = 0.6;
          d.vx = (rnd() - 0.5) * spread; d.vy = (rnd() - 0.5) * spread + 60;
          n--;
        }
      }

      function reset() {
        car = { x: W / 2, tilt: 0 };
        lives = 3; dist = 0; thr = 0.35; tt = 0; inv = 0; shake = 0; spawnT = 1; ws = 120;
        for (var k = 0; k < rocks.length; k++) rocks[k].on = false;
        for (k = 0; k < dust.length; k++) dust[k].on = false;
      }
      reset();

      // ---------- overlay screens ----------
      function clearOv() { while (ov.firstChild) ov.removeChild(ov.firstChild); }
      function showOv(kind) {
        clearOv();
        ov.style.display = "flex";
        var btn = el("button", "a15-main");
        btn.type = "button";
        if (kind === "intro") {
          ov.appendChild(el("h3", "", tx("introTitle")));
          ov.appendChild(el("p", "", tx("intro")));
          ov.appendChild(el("p", "", tx("keys")));
          btn.textContent = tx("start");
          btn.onclick = startGame;
        } else if (kind === "paused") {
          ov.appendChild(el("h3", "", tx("paused")));
          btn.textContent = tx("resume");
          btn.onclick = togglePause;
        } else {
          ov.appendChild(el("h3", "", won ? tx("win") : tx("lose")));
          ov.appendChild(el("p", "", tx("driven") + ": " + Math.floor(dist) + " " + tx("m") + "  ·  " + tx("best") + ": " + best + " " + tx("m")));
          ov.appendChild(el("p", "", tx("real")));
          btn.textContent = tx("again");
          btn.onclick = startGame;
        }
        ov.appendChild(btn);
        try { btn.focus({ preventScroll: true }); } catch (e) { btn.focus(); }
      }
      function hideOv() { ov.style.display = "none"; }

      function startGame() {
        reset();
        phase = "playing";
        won = false;
        hideOv();
        joyEl.classList.add("on");
        say(tx("go"));
        try { wrap.focus({ preventScroll: true }); } catch (e) { wrap.focus(); }
        last = performance.now();
        applyLabels();
      }
      function togglePause() {
        if (phase === "playing") { phase = "paused"; key = {}; showOv("paused"); }
        else if (phase === "paused") { phase = "playing"; hideOv(); last = performance.now(); try { wrap.focus({ preventScroll: true }); } catch (e) {} }
        applyLabels();
      }
      function finish(win) {
        won = win;
        phase = "result";
        key = {}; joy.x = joy.y = 0; knob.style.transform = "";
        var d = Math.floor(dist);
        if (d > best) { best = d; try { localStorage.setItem("a15best", String(best)); } catch (e) {} }
        say(win ? tx("win") : tx("lose"));
        showOv("result");
        applyLabels();
      }

      // ---------- labels (re-run on language change; the game is not restarted) ----------
      function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement; }
      function isFs() { return fsEl() === wrap || wrap.classList.contains("a15-pfs"); }
      function applyLabels() {
        wrap.setAttribute("aria-label", tx("aria"));
        cap.textContent = tx("caption");
        joyEl.setAttribute("aria-label", tx("joy"));
        btnPause.textContent = phase === "paused" ? tx("resume") : tx("pause");
        btnPause.setAttribute("aria-label", btnPause.textContent);
        btnPause.disabled = phase === "intro" || phase === "result";
        btnFs.textContent = isFs() ? "⤡" : "⤢";
        btnFs.setAttribute("aria-label", isFs() ? tx("fsExit") : tx("fs"));
        btnFs.title = isFs() ? tx("fsExit") : tx("fs");
      }
      var unLang = window.onLangChange ? window.onLangChange(function () {
        applyLabels();
        if (phase === "intro") showOv("intro");
        else if (phase === "paused") showOv("paused");
        else if (phase === "result") showOv("result");
      }) : null;

      // ---------- fullscreen (native API; CSS fallback for iPhone) ----------
      function toggleFs() {
        if (fsEl() === wrap) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
        if (wrap.classList.contains("a15-pfs")) { wrap.classList.remove("a15-pfs"); onFs(); return; }
        var rq = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
        function fallback() { wrap.classList.add("a15-pfs"); onFs(); }
        if (!rq) { fallback(); return; }
        try {
          var p = rq.call(wrap);
          if (p && p.catch) p.catch(fallback);
        } catch (e) { fallback(); }
      }
      function onFs() { resize(); applyLabels(); }
      btnFs.onclick = toggleFs;
      btnPause.onclick = togglePause;
      document.addEventListener("fullscreenchange", onFs);
      document.addEventListener("webkitfullscreenchange", onFs);

      // ---------- sizing: fixed 800x500 scene, fitted 16:10 into the box ----------
      var scale = 1;
      function resize() {
        var r = wrap.getBoundingClientRect();
        var w = r.width, h = r.height;
        if (w / h > 1.6) w = h * 1.6; else h = w / 1.6;
        stage.style.width = w + "px";
        stage.style.height = h + "px";
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        scale = canvas.width / W;
      }
      resize();
      var ro = new ResizeObserver(resize);
      ro.observe(wrap);

      // ---------- input ----------
      function onKeyDown(e) {
        if (e.code === "KeyP") { if (phase === "playing" || phase === "paused") togglePause(); return; }
        key[e.code] = 1;
        var scrollKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].indexOf(e.code) >= 0;
        if (scrollKey && e.target === wrap) e.preventDefault();
      }
      function onKeyUp(e) { key[e.code] = 0; }
      function onBlur() { key = {}; }
      wrap.addEventListener("keydown", onKeyDown);
      wrap.addEventListener("keyup", onKeyUp);
      wrap.addEventListener("blur", onBlur);

      var jid = null;
      function joyMove(e) {
        var r = joyEl.getBoundingClientRect();
        var m = r.width / 2 - 8;
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy);
        if (d > m) { dx *= m / d; dy *= m / d; }
        joy.x = dx / m; joy.y = dy / m;
        knob.style.transform = "translate(" + dx + "px," + dy + "px)";
      }
      function joyDown(e) { jid = e.pointerId; try { joyEl.setPointerCapture(jid); } catch (x) {} joyMove(e); }
      function joyMv(e) { if (e.pointerId === jid) joyMove(e); }
      function joyUp(e) { if (e.pointerId === jid) { jid = null; joy.x = joy.y = 0; knob.style.transform = ""; } }
      joyEl.addEventListener("pointerdown", joyDown);
      joyEl.addEventListener("pointermove", joyMv);
      joyEl.addEventListener("pointerup", joyUp);
      joyEl.addEventListener("pointercancel", joyUp);

      function onVis() { if (document.hidden && phase === "playing") togglePause(); }
      document.addEventListener("visibilitychange", onVis);

      // ---------- update ----------
      function update(dt) {
        tt += dt;
        var ix = clamp((key.KeyD || key.ArrowRight ? 1 : 0) - (key.KeyA || key.ArrowLeft ? 1 : 0) + joy.x, -1, 1);
        var target = 0.35;
        if (key.KeyW || key.ArrowUp) target = 1;
        if (key.KeyS || key.ArrowDown) target = 0;
        if (joy.y < -0.15) target = 0.35 + 0.65 * Math.min(1, -joy.y);
        else if (joy.y > 0.15) target = Math.max(0, 0.35 * (1 - joy.y * 1.5));
        thr += (target - thr) * Math.min(1, dt * 3);
        ws = 90 + 220 * thr;
        car.x = clamp(car.x + ix * (200 + 120 * thr) * dt, 34, W - 34);
        car.tilt += (ix * 0.18 - car.tilt) * Math.min(1, dt * 8);
        dist += thr * (13 / 3.6) * 6 * dt;
        if (inv > 0) inv -= dt;
        if (shake > 0) shake -= dt;

        for (var k = 0; k < craters.length; k++) {
          var c = craters[k];
          c.y += ws * dt;
          if (c.y - c.r > H) { c.y = -c.r * 2; c.x = rnd() * W; c.r = 12 + rnd() * 38; }
        }

        spawnT -= dt;
        if (spawnT <= 0) {
          var lvl = Math.min(1, tt / 90);
          spawnT = ((1.1 - 0.5 * lvl) / (0.6 + thr * 0.8)) * (0.7 + rnd() * 0.6);
          for (k = 0; k < rocks.length; k++) {
            if (rocks[k].on) continue;
            var q = rocks[k];
            q.on = true; q.r = 12 + rnd() * 16;
            q.x = q.r + rnd() * (W - 2 * q.r); q.y = -40;
            q.vy = ws * 0.9 + 50 + rnd() * 90;
            q.vx = (rnd() - 0.5) * 60; q.a = 0; q.va = (rnd() - 0.5) * 4;
            break;
          }
        }
        for (k = 0; k < rocks.length; k++) {
          var r = rocks[k];
          if (!r.on) continue;
          r.y += r.vy * dt; r.x += r.vx * dt; r.a += r.va * dt;
          if (r.y > H + 50 || r.x < -50 || r.x > W + 50) { r.on = false; continue; }
          if (inv <= 0 && Math.abs(r.x - car.x) < r.r * 0.8 + 16 && Math.abs(r.y - CAR_Y) < r.r * 0.8 + 26) {
            r.on = false;
            lives--;
            inv = 1.5;
            if (!reduced) { shake = 0.3; emitDust(r.x, r.y, 14, 240); }
            say(tx("hit") + Math.max(0, lives));
            if (lives <= 0) { finish(false); return; }
          }
        }
        if (!reduced && rnd() < thr * 0.9) emitDust(car.x + (rnd() < 0.5 ? -14 : 14), CAR_Y + 26, 1, 30);
        for (k = 0; k < dust.length; k++) {
          var d = dust[k];
          if (!d.on) continue;
          d.x += d.vx * dt; d.y += d.vy * dt; d.l -= dt;
          if (d.l <= 0) d.on = false;
        }
        if (dist >= GOAL) { dist = GOAL; finish(true); }
      }

      // ---------- render ----------
      var FONT = "600 14px Onest, system-ui, sans-serif";
      function render() {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.save();
        if (shake > 0 && !reduced) ctx.translate((rnd() - 0.5) * 8, (rnd() - 0.5) * 8);
        ctx.fillStyle = "#7f8192";
        ctx.fillRect(-10, -10, W + 20, H + 20);
        var k;
        for (k = 0; k < craters.length; k++) {
          var c = craters[k];
          ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r, c.r * 0.9, 0, 0, 7);
          ctx.fillStyle = "#626475"; ctx.fill();
          ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.stroke();
        }
        for (k = 0; k < dust.length; k++) {
          var d = dust[k];
          if (!d.on) continue;
          ctx.globalAlpha = Math.max(0, d.l * 1.6);
          ctx.fillStyle = "#d8d9e2"; ctx.fillRect(d.x, d.y, 3, 3);
        }
        ctx.globalAlpha = 1;
        for (k = 0; k < rocks.length; k++) {
          var r = rocks[k];
          if (!r.on) continue;
          ctx.fillStyle = "rgba(0,0,0,.25)";
          ctx.beginPath(); ctx.arc(r.x + 6, r.y + 6, r.r, 0, 7); ctx.fill();
          ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.a);
          ctx.beginPath();
          for (var s = 0; s < 8; s++) {
            var an = s / 8 * 6.283, px = Math.cos(an) * r.r * r.shape[s], py = Math.sin(an) * r.r * r.shape[s];
            if (s) ctx.lineTo(px, py); else ctx.moveTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = "#3d3e4c"; ctx.fill();
          ctx.lineWidth = 2; ctx.strokeStyle = "#1c1d28"; ctx.stroke();
          ctx.restore();
        }
        // rover, seen from above
        if (!(inv > 0 && Math.floor(inv * 12) % 2)) {
          ctx.save(); ctx.translate(car.x, CAR_Y); ctx.rotate(car.tilt);
          ctx.fillStyle = "#1a1a22";
          ctx.fillRect(-21, -22, 8, 18); ctx.fillRect(13, -22, 8, 18); ctx.fillRect(-21, 10, 8, 18); ctx.fillRect(13, 10, 8, 18);
          ctx.fillStyle = "#dcdad2"; ctx.fillRect(-14, -28, 28, 60);
          ctx.fillStyle = "#b5b3aa"; ctx.fillRect(-11, -12, 9, 12); ctx.fillRect(2, -12, 9, 12);
          ctx.fillStyle = cMoon; ctx.fillRect(-14, -28, 28, 6);
          ctx.beginPath(); ctx.arc(0, 20, 8, 0, 7); ctx.fillStyle = "#f4f4f0"; ctx.fill();
          ctx.strokeStyle = "#777"; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.restore();
        }
        ctx.restore();

        // HUD
        ctx.fillStyle = "rgba(7,11,24,.72)"; ctx.fillRect(0, 0, W, 36);
        ctx.font = FONT; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
        ctx.textAlign = "left"; ctx.fillText("♥ " + lives, 14, 18);
        var bx = 80, bw = 520, p = dist / GOAL;
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(bx, 14, bw, 8);
        ctx.fillStyle = cSignal; ctx.fillRect(bx, 14, bw * p, 8);
        ctx.beginPath(); ctx.arc(bx + bw * p, 18, 7, 0, 7); ctx.fillStyle = cMoon; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText("Falcon", bx + bw + 28, 18);
        ctx.textAlign = "right";
        ctx.fillText((thr * 13).toFixed(1) + " " + tx("kmh"), W - 14, 18);
      }

      // ---------- loop ----------
      var raf = 0, running = true, last = performance.now();
      function frame(now) {
        if (!running) return;
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (phase === "playing") update(dt);
        render();
        raf = requestAnimationFrame(frame);
      }
      applyLabels();
      showOv("intro");
      raf = requestAnimationFrame(frame);

      return function cleanup() {
        running = false;
        cancelAnimationFrame(raf);
        ro.disconnect();
        if (unLang) unLang();
        document.removeEventListener("visibilitychange", onVis);
        document.removeEventListener("fullscreenchange", onFs);
        document.removeEventListener("webkitfullscreenchange", onFs);
        if (fsEl() === wrap) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
        wrap.classList.remove("a15-pfs");
        wrap.removeEventListener("keydown", onKeyDown);
        wrap.removeEventListener("keyup", onKeyUp);
        wrap.removeEventListener("blur", onBlur);
        joyEl.removeEventListener("pointerdown", joyDown);
        joyEl.removeEventListener("pointermove", joyMv);
        joyEl.removeEventListener("pointerup", joyUp);
        joyEl.removeEventListener("pointercancel", joyUp);
        if (style.parentNode) style.parentNode.removeChild(style);
        container.innerHTML = "";
      };
    }
  };
})();
