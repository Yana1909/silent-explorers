/* See eagle.js for the student project module contract. */
/* ------------------------------------------------------------------
   Mars Pathfinder — "Airbag Landing" / "Посадка на подушках"
   A mini-game for the Silent Explorers globe (location id: pathfinder).

   Facts used (NASA, science.nasa.gov/mission/mars-pathfinder):
   - landing July 4, 1997 at Ares Vallis, parachute + airbags (first time)
   - airbags inflated ~330 ft (100 m) above the surface
   - impact ~31 mph (14 m/s), ~15 bounces up to 50 ft (15 m), 2.5 min to stop
   - Sojourner (10.6 kg) rolled down the rear ramp, tilted 20 degrees, on sol 2

   The physics is a simplified game model, not to scale.
   Colours and fonts follow css/styles.css (:root tokens, Unbounded + Onest).
------------------------------------------------------------------ */
(function () {
  "use strict";

  var LOCATION_ID = "pathfinder";

  var W = 800, H = 500;      // virtual size of the scene
  var GY = 410;              // ground line in the bounce scene
  var R = 46;                // airbag radius
  var G = 900;               // gravity (px/s^2)
  var BOUNCES = 15;

  /* site tokens (css/styles.css) */
  var C = {
    bg: "#070b18", bg2: "#0c1326", surface: "#121b35", surface2: "#1a2646", line: "#34437a",
    ink: "#f3f6ff", dim: "#b9c3e2", onAccent: "#0b1020",
    mars: "#ff7b4a", marsDeep: "#9a4426", moon: "#ecd292", moonDeep: "#8a7443",
    signal: "#62e6c4", ok: "#7fd8a6"
  };
  var F_BODY = "'Onest', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  var F_DISP = "'Unbounded', 'Onest', ui-sans-serif, system-ui, sans-serif";
  function font(size, weight, display) { return (weight || 400) + " " + size + "px " + (display ? F_DISP : F_BODY); }

  /* ---------- texts: { en, uk } ---------- */
  var TXT = {
    title: { en: "Airbag Landing", uk: "Посадка на подушках" },
    introTitle: { en: "Land Pathfinder", uk: "Посади Патфайндер" },
    introBody: {
      en: "July 4, 1997. Pathfinder falls toward Ares Vallis on a parachute. Inflate the airbags at about 100\u00A0m, then steer the bounces away from sharp rocks.",
      uk: "4 липня 1997 року. Патфайндер на парашуті падає до долини Ареса. Надуй подушки приблизно на висоті 100\u00A0м, а потім спрямовуй підскоки повз гостре каміння."
    },
    start: { en: "Start", uk: "Почати" },
    tapHint: { en: "Tap or press Space", uk: "Торкнись або натисни пробіл" },
    target: { en: "100\u00A0m", uk: "100\u00A0м" },
    inflate: { en: "Inflate airbags", uk: "Надути подушки" },
    hintDescent: { en: "Tap when the marker is in the green zone", uk: "Торкнись, коли маркер у зеленій зоні" },
    fbPerfect: { en: "Perfect timing!", uk: "Ідеальний момент!" },
    fbEarly: { en: "Too early — less pressure", uk: "Надто рано — менший тиск" },
    fbLate: { en: "Too late — barely in time", uk: "Надто пізно — ледь устигли" },
    bounce: { en: "Bounce {n} / {total}", uk: "Підскок {n} із {total}" },
    airbags: { en: "Airbags", uk: "Подушки" },
    slower: { en: "slower", uk: "повільніше" },
    faster: { en: "faster", uk: "швидше" },
    hintBounce: {
      en: "Hold left or right to land between the rocks",
      uk: "Утримуй ліворуч чи праворуч — приземляйся між камінням"
    },
    crashTitle: { en: "Hard landing", uk: "Жорстка посадка" },
    crashBody: {
      en: "The airbags were not inflated in time. Pathfinder hit the ground at full speed.",
      uk: "Подушки не встигли надутися. Патфайндер вдарився об ґрунт на повній швидкості."
    },
    popTitle: { en: "Airbags punctured", uk: "Подушки пробито" },
    popBody: {
      en: "Sharp rocks tore the airbags. Ares Vallis is among the rockiest parts of Mars, so a rock-strewn landing was a real risk.",
      uk: "Гостре каміння розірвало подушки. Долина Ареса — одна з найкам\u2019янистіших ділянок Марса, тож посадка серед каміння була справжнім ризиком."
    },
    winTitle: { en: "Pathfinder has stopped!", uk: "Патфайндер зупинився!" },
    winBody: {
      en: "The lander, named the Carl Sagan Memorial Station, had made it. On sol 2 Sojourner rolled down the lander\u2019s rear ramp, tilted at 20° — the first rover on Mars.",
      uk: "Посадковий апарат — Меморіальна станція Карла Сагана — упорався. На 2-гу добу (сол) Sojourner («Соджорнер») з\u2019їхав по задньому трапу, нахиленому під кутом 20° — перший марсохід на Марсі."
    },
    winFacts: {
      en: "Landing: 31 mph (14 m/s), about 15 bounces up to 15\u00A0m high, 2.5 minutes to stop.",
      uk: "Посадка: 31 миля/год (14\u00A0м/с), близько 15 підскоків заввишки до 15\u00A0м, 2,5 хвилини до зупинки."
    },
    intactLabel: { en: "Airbags intact", uk: "Подушки цілі" },
    again: { en: "Play again", uk: "Зіграти ще раз" },
    aria: {
      en: "Mini-game: inflate the airbags and land Mars Pathfinder",
      uk: "Міні-гра: надуй подушки та посади Mars Pathfinder"
    }
  };

  function pk(v) {
    if (typeof window.pick === "function") return window.pick(v);
    if (v && typeof v === "object") return v.en || "";
    return v;
  }
  function tx(key, params) {
    var s = pk(TXT[key]) || "";
    if (params) {
      for (var k in params) {
        if (Object.prototype.hasOwnProperty.call(params, k)) s = s.split("{" + k + "}").join(params[k]);
      }
    }
    return s;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function apex(k) { return 170 * Math.pow(0.8, k); }
  function hash(i, k) { return Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1; }

  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS[LOCATION_ID] = {
    title: TXT.title,
    type: "game",
    init: function (container) {
      container.innerHTML = "";

      var canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:100%;display:block;cursor:pointer;background:" + C.bg + ";outline:none;user-select:none;-webkit-user-select:none";
      canvas.style.touchAction = "pan-y";
      canvas.tabIndex = 0;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", tx("aria"));
      container.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      var lastW = 0, lastH = 0, dpr = 1, lastTA = "pan-y";

      function checkSize() {
        var w = container.clientWidth, h = container.clientHeight;
        if (!w) return;
        if (!h) h = Math.round(w * 0.625);
        if (w === lastW && h === lastH) return;
        lastW = w; lastH = h;
        dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      /* ---------- state ---------- */
      var S, keySide = 0, ptrSide = 0, downMode = "";

      function newState(mode) {
        return {
          mode: mode, mt: 0, t: 0, scene: "descent",
          alt: 900, fall: 78, inflated: false, ip: 0, inflateT: 0, integ: 100, fb: "",
          bn: 0, x: 0, vx: 0, vy: 0, h: 0, ang: 0,
          rocks: [], parts: [], flash: 0, wt: 0, reason: ""
        };
      }
      S = newState("intro");

      function setMode(m) { S.mode = m; S.mt = 0; }
      function startRun() { S = newState("descent"); S.alt = 1000; }

      function inflate() {
        if (S.inflated) return;
        S.inflated = true;
        S.inflateT = S.t;
        var a = S.alt, d = Math.abs(a - 100);
        S.integ = Math.round(clamp(100 - Math.max(0, d - 60) * 0.4, 40, 100));
        S.fb = a > 160 ? "fbEarly" : (a < 40 ? "fbLate" : "fbPerfect");
      }

      function makeRocks() {
        var rocks = [], x = 300;
        for (var i = 0; i < 12; i++) {
          rocks.push({ x: x, hw: 16 + Math.random() * 9, hit: false });
          x += 200 + Math.random() * 110;
        }
        return rocks;
      }

      function puff(x, n) {
        for (var i = 0; i < n; i++) {
          S.parts.push({
            x: x + (Math.random() - 0.5) * 40, y: GY - 2,
            vx: (Math.random() - 0.5) * 120, vy: -30 - Math.random() * 70,
            life: 0.7 + Math.random() * 0.4, max: 1.1
          });
        }
      }

      function startBounce() {
        setMode("bounce");
        S.scene = "bounce";
        S.bn = 0; S.x = 0; S.vx = 150; S.h = 0; S.ang = 0;
        S.vy = Math.sqrt(2 * G * apex(0));
        S.rocks = makeRocks();
        puff(S.x, 10);
      }

      function lose(reason) { S.reason = reason; setMode("lose"); }

      function action() {
        if (S.mode === "intro") startRun();
        else if (S.mode === "descent") inflate();
        else if ((S.mode === "win" || S.mode === "lose") && S.mt > 0.6) startRun();
      }

      /* ---------- update ---------- */
      function update(dt) {
        S.t += dt; S.mt += dt;
        if (S.flash > 0) S.flash = Math.max(0, S.flash - dt);

        for (var i = S.parts.length - 1; i >= 0; i--) {
          var p = S.parts[i];
          p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt;
          if (p.life <= 0) S.parts.splice(i, 1);
        }

        if (S.mode === "intro") {
          S.scene = "descent";
          S.alt = 900 - ((S.t * 70) % 800);
        } else if (S.mode === "descent") {
          S.alt -= S.fall * dt;
          if (S.inflated) S.ip = Math.min(1, (S.t - S.inflateT) / 0.4);
          if (S.alt <= 0) {
            S.alt = 0;
            if (!S.inflated) lose("crash"); else startBounce();
          }
        } else if (S.mode === "bounce") {
          var side = keySide || ptrSide;
          if (side) S.vx = clamp(S.vx + side * 240 * dt, 70, 270);
          S.vy -= G * dt;
          S.h += S.vy * dt;
          S.x += S.vx * dt;
          S.ang += S.vx * dt / R;
          if (S.h <= 0 && S.vy < 0) {
            S.h = 0;
            for (var r = 0; r < S.rocks.length; r++) {
              var rk = S.rocks[r];
              if (!rk.hit && Math.abs(S.x - rk.x) < rk.hw + 16) {
                rk.hit = true; S.integ -= 25; S.flash = 0.45;
              }
            }
            puff(S.x, 6);
            S.bn++;
            if (S.integ <= 0) { S.integ = 0; lose("pop"); return; }
            if (S.bn >= BOUNCES) { S.vy = 0; setMode("roll"); }
            else S.vy = Math.sqrt(2 * G * apex(S.bn));
          }
        } else if (S.mode === "roll") {
          S.vx *= Math.exp(-2.2 * dt);
          S.x += S.vx * dt;
          S.ang += S.vx * dt / R;
          if (S.vx < 6) { S.vx = 0; setMode("win"); }
        } else if (S.mode === "win") {
          S.wt += dt;
        }

        var ta = (S.mode === "descent" || S.mode === "bounce" || S.mode === "roll") ? "none" : "pan-y";
        if (ta !== lastTA) { canvas.style.touchAction = ta; lastTA = ta; }
      }

      /* ---------- scene helpers (virtual 800x500) ---------- */
      function rr(x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      function wrap(text, maxW, f) {
        ctx.font = f;
        var words = String(text).split(" "), lines = [], cur = "";
        for (var i = 0; i < words.length; i++) {
          var test = cur ? cur + " " + words[i] : words[i];
          if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = words[i]; }
          else cur = test;
        }
        if (cur) lines.push(cur);
        return lines;
      }

      function sky() {
        var g = ctx.createLinearGradient(0, 0, 0, GY);
        g.addColorStop(0, C.bg);
        g.addColorStop(0.5, C.surface2);
        g.addColorStop(0.82, "#7a3b27");
        g.addColorStop(1, "#d9693f");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        for (var i = 0; i < 30; i++) {
          ctx.fillStyle = "rgba(255,255,255," + (0.25 + hash(i, 3) * 0.4) + ")";
          ctx.beginPath();
          ctx.arc(hash(i, 1) * W, hash(i, 2) * GY * 0.55, 0.7 + hash(i, 4) * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function hills(camX, baseY, amp, par, col) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (var x = 0; x <= W; x += 20) {
          var wx = x + camX * par;
          var y = baseY - (Math.sin(wx * 0.008) * amp + Math.sin(wx * 0.021 + 1.3) * amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      }

      function groundFill(y) {
        var g = ctx.createLinearGradient(0, y, 0, H);
        g.addColorStop(0, "#7b3721");
        g.addColorStop(1, "#2e140c");
        ctx.fillStyle = g;
        ctx.fillRect(0, y, W, H - y);
      }

      function pebbles(camX) {
        var i0 = Math.floor(camX / 40) - 1;
        ctx.fillStyle = "#52261a";
        for (var i = i0; i < i0 + 24; i++) {
          var a = hash(i, 5), b = hash(i, 6);
          ctx.beginPath();
          ctx.ellipse(i * 40 + a * 30 - camX, GY + 14 + b * 70, 1.5 + a * 3, 1 + a * 1.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      function rock(x, hw, hit) {
        ctx.beginPath();
        ctx.moveTo(x - hw, GY + 2);
        ctx.lineTo(x - hw * 0.7, GY - hw * 0.7);
        ctx.lineTo(x - hw * 0.1, GY - hw * 1.15);
        ctx.lineTo(x + hw * 0.6, GY - hw * 0.8);
        ctx.lineTo(x + hw, GY + 2);
        ctx.closePath();
        ctx.fillStyle = "#2e140c";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = hit ? C.mars : "#1a0b07";
        ctx.stroke();
        ctx.fillStyle = "rgba(255,200,160,.16)";
        ctx.beginPath();
        ctx.moveTo(x - hw * 0.7, GY - hw * 0.7);
        ctx.lineTo(x - hw * 0.1, GY - hw * 1.15);
        ctx.lineTo(x - hw * 0.05, GY - hw * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      function airbag(x, y, r, ang) {
        if (r < 1) return;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#8794c4";
        ctx.fillStyle = "#e1e7fa";
        for (var i = 0; i < 6; i++) {
          var a = ang + i * Math.PI / 3;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * r * 0.58, y + Math.sin(a) * r * 0.58, r * 0.45, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        }
        ctx.fillStyle = C.ink;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.52, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      }

      function landerSmall(x, y) {
        ctx.fillStyle = C.moon;
        ctx.beginPath();
        ctx.moveTo(x - 18, y + 13); ctx.lineTo(x + 18, y + 13); ctx.lineTo(x, y - 14);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.moonDeep;
        ctx.beginPath();
        ctx.moveTo(x, y - 14); ctx.lineTo(x + 18, y + 13); ctx.lineTo(x + 4, y + 13);
        ctx.closePath(); ctx.fill();
      }

      function chute(cx, cy, lx, ly, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        if (ly !== null) {
          ctx.strokeStyle = "rgba(243,246,255,.6)";
          ctx.lineWidth = 1;
          for (var i = -1; i <= 1; i++) {
            ctx.beginPath(); ctx.moveTo(cx + i * 60, cy); ctx.lineTo(lx, ly); ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.ellipse(cx, cy, 70, 42, 0, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = C.ink;
        ctx.fill();
        ctx.save();
        ctx.clip();
        ctx.fillStyle = C.mars;
        ctx.fillRect(cx - 47, cy - 42, 23, 42);
        ctx.fillRect(cx + 24, cy - 42, 23, 42);
        ctx.restore();
        ctx.restore();
      }

      function landerOpen(x) {
        ctx.fillStyle = C.moon;
        ctx.beginPath();
        ctx.moveTo(x - 34, GY); ctx.lineTo(x + 34, GY); ctx.lineTo(x + 24, GY - 14); ctx.lineTo(x - 24, GY - 14);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = C.moonDeep;
        ctx.beginPath();
        ctx.moveTo(x - 34, GY); ctx.lineTo(x - 58, GY - 6); ctx.lineTo(x - 24, GY - 14);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x + 34, GY); ctx.lineTo(x + 12, GY - 30); ctx.lineTo(x + 24, GY - 14);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = C.dim;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 4, GY - 14); ctx.lineTo(x - 4, GY - 40); ctx.stroke();
        ctx.fillStyle = C.bg2;
        ctx.fillRect(x - 9, GY - 46, 10, 7);
      }

      function rover(x) {
        ctx.fillStyle = C.surface3 || "#243259";
        ctx.fillRect(x - 13, GY - 17, 26, 9);
        ctx.fillStyle = C.signal;
        ctx.fillRect(x - 13, GY - 21, 26, 4);
        ctx.fillStyle = C.bg;
        for (var i = -1; i <= 1; i++) {
          ctx.beginPath(); ctx.arc(x + i * 9, GY - 4, 4, 0, Math.PI * 2); ctx.fill();
        }
      }

      function drawDescent() {
        sky();
        var gy = 216 + S.alt * 0.28;
        hills(0, gy - 4, 16, 0, "#a8512f");
        groundFill(gy);
        ctx.fillStyle = "#2e140c";
        for (var i = 0; i < 9; i++) {
          var rx = 60 + i * 88 + (i % 2) * 20;
          ctx.beginPath();
          ctx.ellipse(rx, gy + 14 + (i % 3) * 16, 14 + (i % 4) * 4, 7 + (i % 3) * 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        var lx = 400 + Math.sin(S.t * 1.3) * 40;
        var rNow = S.inflated ? 16 + 30 * S.ip : 16;
        var ly = Math.min(170, gy - rNow);

        if (!S.inflated) {
          chute(lx, ly - 100, lx, ly - 14, 1);
        } else {
          var ct = S.t - S.inflateT;
          if (ct < 1.2) chute(lx + ct * 30, ly - 100 - ct * 220, null, null, 1 - ct / 1.2);
        }
        if (S.inflated && S.ip > 0) airbag(lx, ly, 46 * S.ip, S.t * 0.6);
        else landerSmall(lx, ly);
      }

      function drawBounce() {
        var camX = S.x - 260;
        sky();
        hills(camX, GY - 20, 36, 0.15, "#a8512f");
        hills(camX, GY - 4, 22, 0.4, "#8a3f26");
        groundFill(GY);
        pebbles(camX);

        var i;
        for (i = 0; i < S.rocks.length; i++) {
          var rk = S.rocks[i], sx = rk.x - camX;
          if (sx > -60 && sx < W + 60) rock(sx, rk.hw, rk.hit);
        }

        var bx = S.x - camX;
        var by = GY - R - S.h;

        if (S.mode === "bounce") {
          var tl = (S.vy + Math.sqrt(S.vy * S.vy + 2 * G * S.h)) / G;
          var pred = S.x + S.vx * tl;
          var danger = false;
          for (i = 0; i < S.rocks.length; i++) {
            if (!S.rocks[i].hit && Math.abs(pred - S.rocks[i].x) < S.rocks[i].hw + 16) danger = true;
          }
          ctx.strokeStyle = danger ? C.mars : C.signal;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(pred - camX, GY + 8, 20, 6, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(0,0,0," + (0.3 * (1 - clamp(S.h / 200, 0, 1))) + ")";
        ctx.beginPath();
        ctx.ellipse(bx, GY + 4, R * (1 - clamp(S.h / 300, 0, 0.5)), 8, 0, 0, Math.PI * 2);
        ctx.fill();

        if (S.mode === "win") {
          var deflate = clamp(S.wt / 1.2, 0, 1);
          ctx.fillStyle = "#e1e7fa"; ctx.strokeStyle = "#8794c4"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.ellipse(bx - 38, GY - 8, 40, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(bx + 42, GY - 8, 40, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          if (deflate < 1) { var rd = R * (1 - deflate); airbag(bx, GY - rd, rd, S.ang); }
          landerOpen(bx);
          rover(bx + 40 + clamp(S.wt / 3, 0, 1) * 120);
        } else {
          airbag(bx, by, R, S.ang);
        }

        if (S.flash > 0) {
          ctx.fillStyle = "rgba(255,123,74," + (0.4 * S.flash / 0.45) + ")";
          ctx.beginPath(); ctx.arc(bx, by, R + 6, 0, Math.PI * 2); ctx.fill();
        }

        for (i = 0; i < S.parts.length; i++) {
          var p = S.parts[i];
          ctx.fillStyle = "rgba(255,170,130," + clamp(p.life / p.max, 0, 1) * 0.6 + ")";
          ctx.beginPath(); ctx.arc(p.x - camX, p.y, 3 + (1 - p.life / p.max) * 4, 0, Math.PI * 2); ctx.fill();
        }
      }

      /* ---------- interface layer (real CSS pixels, site fonts) ---------- */
      function chip(x, y, text, o) {
        o = o || {};
        var size = o.size || 12;
        ctx.font = font(size, o.weight || 600);
        var padX = 11, h = size + 14;
        var w = Math.ceil(ctx.measureText(text).width) + padX * 2;
        var left = o.align === "right" ? x - w : (o.align === "center" ? x - w / 2 : x);
        rr(left, y - h / 2, w, h, h / 2);
        ctx.fillStyle = "rgba(12,19,38,.9)"; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = o.border || C.line; ctx.stroke();
        ctx.fillStyle = o.color || C.ink;
        ctx.textAlign = "left";
        ctx.fillText(text, left + padX, y + 0.5);
        return w;
      }

      function pill(cx, cy, text) {
        ctx.font = font(15, 700);
        var h = 42, w = Math.ceil(ctx.measureText(text).width) + 48;
        rr(cx - w / 2, cy - h / 2, w, h, h / 2);
        ctx.fillStyle = C.signal; ctx.fill();
        ctx.fillStyle = C.onAccent;
        ctx.textAlign = "center";
        ctx.fillText(text, cx, cy + 0.5);
        ctx.textAlign = "left";
      }

      function altimeter() {
        var cw = lastW, ch = lastH;
        var cx = cw - 12 - 23, top = 26, bot = ch - 26, L = bot - top;
        rr(cw - 58, 12, 46, ch - 24, 14);
        ctx.fillStyle = "rgba(12,19,38,.9)"; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = C.line; ctx.stroke();
        rr(cx - 6, top, 12, L, 6);
        ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fill();
        var zTop = bot - 160 / 1000 * L, zBot = bot - 40 / 1000 * L;
        rr(cx - 6, zTop, 12, zBot - zTop, 5);
        ctx.fillStyle = "rgba(98,230,196,.6)"; ctx.fill();
        var my = bot - clamp(S.alt, 0, 1000) / 1000 * L;
        ctx.fillStyle = C.ink;
        ctx.beginPath(); ctx.moveTo(cx - 8, my); ctx.lineTo(cx - 17, my - 6); ctx.lineTo(cx - 17, my + 6); ctx.closePath(); ctx.fill();
        chip(cw - 66, (zTop + zBot) / 2, tx("target"), { align: "right", color: C.signal, border: C.signal, size: 11 });
        chip(cw - 66, clamp(my, 22, ch - 22), Math.max(0, Math.round(S.alt)) + "\u00A0" + (pk({ en: "m", uk: "м" })), { align: "right", weight: 700, size: 12 });
      }

      function feedback() {
        if (!S.fb) return;
        var good = S.fb === "fbPerfect";
        chip(lastW / 2 - 24, 24, tx(S.fb), { align: "center", color: good ? C.signal : C.moon, border: good ? C.signal : C.moonDeep, weight: 700, size: 13 });
      }

      function bounceHud() {
        var cw = lastW, ch = lastH;
        chip(12, 24, tx("bounce", { n: Math.min(BOUNCES, S.bn + 1), total: BOUNCES }), { weight: 700, size: 13 });

        var bw = 132, bh = 40, bx = cw - 12 - 46 * 0 - bw, by = 12;
        if (S.mode === "descent") bx = cw - 12 - bw; // (not used in descent)
        rr(bx, by, bw, bh, 14);
        ctx.fillStyle = "rgba(12,19,38,.9)"; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = C.line; ctx.stroke();
        var pc = clamp(S.integ, 0, 100);
        ctx.font = font(11, 600);
        ctx.fillStyle = C.dim; ctx.textAlign = "left";
        ctx.fillText(tx("airbags"), bx + 12, by + 14);
        ctx.textAlign = "right"; ctx.fillStyle = C.ink; ctx.font = font(12, 700);
        ctx.fillText(Math.round(pc) + "%", bx + bw - 12, by + 14);
        rr(bx + 12, by + 26, bw - 24, 6, 3);
        ctx.fillStyle = C.surface2 || "#1a2646"; ctx.fill();
        if (pc > 0) {
          rr(bx + 12, by + 26, (bw - 24) * pc / 100, 6, 3);
          ctx.fillStyle = pc > 60 ? C.signal : (pc > 30 ? C.moon : C.mars);
          ctx.fill();
        }
        ctx.textAlign = "left";

        if (S.mode === "bounce") {
          if (S.t - S.inflateT < 3) feedback();
          chip(12, ch - 22, "\u25C0  " + tx("slower"), { color: C.dim, size: 12 });
          chip(cw - 12, ch - 22, tx("faster") + "  \u25B6", { align: "right", color: C.dim, size: 12 });
          if (S.mt < 6) chip(cw / 2, ch - 60, tx("hintBounce"), { align: "center", size: 12 });
        }
      }

      function descentHud() {
        var cw = lastW, ch = lastH;
        altimeter();
        if (S.mode !== "descent") return;
        if (!S.inflated) {
          chip((cw - 58) / 2, ch - 66, tx("hintDescent"), { align: "center", size: 12, color: C.dim });
          pill((cw - 58) / 2, ch - 34, tx("inflate"));
        } else {
          feedback();
        }
      }

      function starRating(p) { return p >= 80 ? "\u2605\u2605\u2605" : (p >= 50 ? "\u2605\u2605\u2606" : "\u2605\u2606\u2606"); }

      function panel(o) {
        var cw = lastW, ch = lastH;
        var pw = Math.min(cw - 24, 420), pad = 16, inner = pw - pad * 2;
        var tSize = cw < 420 ? 15 : 17;
        var tl = wrap(o.title, inner, font(tSize, 700, true));
        var bl = wrap(o.body, inner, font(13, 400));
        var el = o.extra ? wrap(o.extra, inner, font(12, 400)) : [];

        function height(withExtra) {
          var h = pad + tl.length * (tSize + 7) + 8 + bl.length * 19;
          if (o.stat) h += 12 + 54;
          if (withExtra && el.length) h += 10 + el.length * 16;
          h += 14 + 42;
          if (o.hint) h += 8 + 14;
          return h + pad;
        }
        var withExtra = el.length > 0;
        if (withExtra && height(true) > ch - 16) withExtra = false;
        var ph = height(withExtra);
        var px = (cw - pw) / 2, py = Math.max(8, (ch - ph) / 2);

        rr(px, py, pw, ph, 18);
        ctx.fillStyle = "rgba(18,27,53,.95)"; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = C.line; ctx.stroke();

        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        var y = py + pad, i;
        ctx.fillStyle = C.ink; ctx.font = font(tSize, 700, true);
        for (i = 0; i < tl.length; i++) { ctx.fillText(tl[i], cw / 2, y); y += tSize + 7; }
        y += 1;
        ctx.fillStyle = C.dim; ctx.font = font(13, 400);
        for (i = 0; i < bl.length; i++) { ctx.fillText(bl[i], cw / 2, y); y += 19; }
        y += 7;

        if (o.stat) {
          y += 5;
          var tx0 = px + pad;
          rr(tx0, y, inner, 54, 12);
          ctx.fillStyle = C.bg2; ctx.fill();
          ctx.strokeStyle = C.line; ctx.stroke();
          ctx.textAlign = "left";
          ctx.font = font(24, 700, true);
          ctx.fillStyle = C.mars;
          var big = o.stat.value;
          ctx.fillText(big, tx0 + 14, y + 13);
          var bwid = ctx.measureText(big).width;
          ctx.font = font(11, 700);
          ctx.fillStyle = C.dim;
          ctx.fillText(String(o.stat.label).toUpperCase(), tx0 + 14 + bwid + 14, y + 11);
          ctx.font = font(16, 700);
          ctx.fillStyle = C.moon;
          ctx.fillText(o.stat.stars, tx0 + 14 + bwid + 14, y + 27);
          y += 54 + 7;
          ctx.textAlign = "center";
        }

        if (withExtra) {
          y += 3;
          ctx.fillStyle = C.dim; ctx.font = font(12, 400);
          for (i = 0; i < el.length; i++) { ctx.fillText(el[i], cw / 2, y); y += 16; }
          y += 7;
        }

        ctx.textBaseline = "middle";
        pill(cw / 2, y + 7 + 21, o.cta);
        if (o.hint) {
          ctx.textAlign = "center"; ctx.fillStyle = C.dim; ctx.font = font(12, 400);
          ctx.fillText(o.hint, cw / 2, y + 7 + 42 + 16);
        }
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
      }

      function drawUI() {
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        if (S.scene === "descent") descentHud(); else bounceHud();

        if (S.mode === "intro") {
          panel({ title: tx("introTitle"), body: tx("introBody"), cta: tx("start"), hint: tx("tapHint") });
        } else if (S.mode === "lose") {
          var crash = S.reason === "crash";
          panel({
            title: crash ? tx("crashTitle") : tx("popTitle"),
            body: crash ? tx("crashBody") : tx("popBody"),
            cta: tx("again"), hint: S.mt > 0.6 ? tx("tapHint") : ""
          });
        } else if (S.mode === "win" && S.wt > 3) {
          var p = Math.round(clamp(S.integ, 0, 100));
          panel({
            title: tx("winTitle"), body: tx("winBody"), extra: tx("winFacts"),
            stat: { value: p + "%", label: tx("intactLabel"), stars: starRating(p) },
            cta: tx("again")
          });
        }
      }

      function render() {
        var cw = canvas.width, ch = canvas.height;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, cw, ch);
        var s = Math.min(cw / W, ch / H);
        var ox = (cw - W * s) / 2, oy = (ch - H * s) / 2;
        ctx.setTransform(s, 0, 0, s, ox, oy);
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
        if (S.scene === "descent") drawDescent(); else drawBounce();
        ctx.restore();

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawUI();
      }

      /* ---------- input ---------- */
      function targetOk(e) {
        var t = e.target;
        return !t || t === document.body || t === canvas || container.contains(t);
      }
      function onKeyDown(e) {
        if (!document.body.contains(container) || !targetOk(e)) return;
        var k = e.key;
        if (k === " " || k === "Enter") {
          e.preventDefault();
          if (!e.repeat) action();
        } else if (k === "ArrowLeft" || k === "a" || k === "A") {
          keySide = -1; e.preventDefault();
        } else if (k === "ArrowRight" || k === "d" || k === "D") {
          keySide = 1; e.preventDefault();
        }
      }
      function onKeyUp(e) {
        var k = e.key;
        if ((k === "ArrowLeft" || k === "a" || k === "A") && keySide === -1) keySide = 0;
        if ((k === "ArrowRight" || k === "d" || k === "D") && keySide === 1) keySide = 0;
      }
      function onPointerDown(e) {
        downMode = S.mode;
        var rect = canvas.getBoundingClientRect();
        if (S.mode === "descent") {
          inflate();
        } else if (S.mode === "bounce" || S.mode === "roll") {
          ptrSide = (e.clientX - rect.left) < rect.width / 2 ? -1 : 1;
          try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      }
      function onPointerEnd() { ptrSide = 0; }
      function onClick() {
        // start / restart only on a real tap, so scrolling the card never triggers it
        if ((S.mode === "intro" || S.mode === "win" || S.mode === "lose") && downMode === S.mode) action();
      }

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("click", onClick);
      window.addEventListener("pointerup", onPointerEnd);
      window.addEventListener("pointercancel", onPointerEnd);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      /* ---------- loop ---------- */
      var raf = 0, last = 0, dead = false;
      function loop(ts) {
        if (dead) return;
        var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
        last = ts;
        checkSize();
        update(dt);
        render();
        raf = requestAnimationFrame(loop);
      }
      checkSize();
      raf = requestAnimationFrame(loop);

      /* ---------- cleanup ---------- */
      return function cleanup() {
        dead = true;
        cancelAnimationFrame(raf);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("click", onClick);
        window.removeEventListener("pointerup", onPointerEnd);
        window.removeEventListener("pointercancel", onPointerEnd);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    }
  };
})();
