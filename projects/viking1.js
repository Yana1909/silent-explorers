/* See eagle.js for the student project module contract. */
/* ------------------------------------------------------------------
   Viking 1 — "50 Years on Mars" (location id: viking1)
   An interactive story with a quiz. The story is a separate page,
   assets/projects/viking1/index.html, shown full screen on top of the globe.

   Facts: NASA science.nasa.gov/mission/viking and NSSDCA 1975-075C / 1975-075A.
------------------------------------------------------------------ */
(function () {
  "use strict";

  var LOCATION_ID = "viking1";
  var PAGE = "assets/projects/viking1/index.html";

  var TXT = {
    title: { en: "Viking 1: 50 Years on Mars", uk: "Вікінг-1: 50 років на Марсі" },
    head: { en: "Meet Viking 1", uk: "Знайомся: Viking 1" },
    body: {
      en: "A short interactive story: follow the trip to Mars, look inside the lander, try the soil game and take the quiz.",
      uk: "Коротка інтерактивна історія: політ до Марса, будова посадкового апарата, гра з ґрунтом і квіз."
    },
    note: { en: "The story is in English.", uk: "Історія англійською мовою." },
    open: { en: "Open the story", uk: "Відкрити історію" },
    close: { en: "Close", uk: "Закрити" },
    frame: { en: "Viking 1: 50 Years on Mars, interactive story", uk: "Viking 1: 50 років на Марсі, інтерактивна історія" }
  };

  function pk(v) {
    if (typeof window.pick === "function") return window.pick(v);
    return v && typeof v === "object" ? (v.en || "") : v;
  }

  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};
  window.STUDENT_PROJECTS[LOCATION_ID] = {
    title: TXT.title,
    type: "quiz",
    init: function (container) {
      container.innerHTML = "";

      var box = document.createElement("div");
      box.style.cssText = "width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
        "gap:10px;padding:16px;text-align:center;box-sizing:border-box;" +
        "background:radial-gradient(120% 120% at 50% 0%,#9a4426 0%,#4b2328 45%,#070b18 100%);color:#f3f6ff;" +
        "font-family:'Onest',ui-sans-serif,system-ui,sans-serif;overflow:auto";
      var h = document.createElement("h3");
      h.style.cssText = "margin:0;font-family:'Unbounded','Onest',sans-serif;font-size:clamp(15px,3.4vw,22px);line-height:1.25";
      var p = document.createElement("p");
      p.style.cssText = "margin:0;max-width:46ch;font-size:clamp(12px,2.2vw,15px);line-height:1.45;color:#e6ecff";
      var n = document.createElement("p");
      n.style.cssText = "margin:0;font-size:12px;color:#b9c3e2";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.style.cssText = "min-height:44px;padding:0 22px;border:0;border-radius:999px;background:#62e6c4;color:#0b1020;" +
        "font:700 15px 'Onest',ui-sans-serif,system-ui,sans-serif;cursor:pointer";
      box.appendChild(h); box.appendChild(p); box.appendChild(n); box.appendChild(btn);
      container.appendChild(box);

      var overlay = null, closeBtn = null, prevFocus = null;

      function labels() {
        h.textContent = pk(TXT.head);
        p.textContent = pk(TXT.body);
        n.textContent = pk(TXT.note);
        btn.textContent = pk(TXT.open);
        if (overlay) {
          closeBtn.textContent = "✕ " + pk(TXT.close);
          overlay.firstChild.nextSibling.setAttribute("title", pk(TXT.frame));
        }
      }

      function onKey(e) { if (e.key === "Escape") close(); }

      function open() {
        if (overlay) return;
        prevFocus = document.activeElement;
        overlay = document.createElement("div");
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.style.cssText = "position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;background:#0b0f29";
        var bar = document.createElement("div");
        bar.style.cssText = "flex:0 0 auto;display:flex;justify-content:flex-end;padding:6px 10px;background:#070b18;border-bottom:1px solid #34437a";
        closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.style.cssText = "min-height:40px;padding:0 16px;border-radius:999px;border:1px solid #34437a;background:#121b35;color:#f3f6ff;" +
          "font:600 14px 'Onest',ui-sans-serif,system-ui,sans-serif;cursor:pointer";
        closeBtn.onclick = close;
        bar.appendChild(closeBtn);
        var frame = document.createElement("iframe");
        frame.src = PAGE;
        frame.style.cssText = "flex:1 1 auto;width:100%;border:0;background:#0b0f29";
        frame.setAttribute("allow", "fullscreen");
        overlay.appendChild(bar);
        overlay.appendChild(frame);
        document.body.appendChild(overlay);
        document.addEventListener("keydown", onKey);
        labels();
        try { closeBtn.focus(); } catch (e) {}
      }

      function close() {
        if (!overlay) return;
        document.removeEventListener("keydown", onKey);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        overlay = null; closeBtn = null;
        try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch (e) {}
      }

      btn.addEventListener("click", open);
      labels();
      var unLang = typeof window.onLangChange === "function" ? window.onLangChange(labels) : null;

      return function cleanup() {
        close();
        if (unLang) unLang();
        btn.removeEventListener("click", open);
        if (box.parentNode) box.parentNode.removeChild(box);
      };
    }
  };
})();
