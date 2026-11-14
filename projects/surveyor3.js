/* Student project: a comic book for Surveyor 3. The pages turn like a real book (CSS 3D).
   All content lives in CONTENT; pages are in assets/projects/surveyor3/. */
(function(){
  window.STUDENT_PROJECTS = window.STUDENT_PROJECTS || {};

  var CONTENT = {
    title: { en: "Surveyor 3: Lunar Encounter", uk: "Surveyor 3: зустріч на Місяці" },
    note: { en: "AI-generated illustrations based on real mission facts", uk: "Ілюстрації створені ШІ за реальними фактами місії" },
    pages: [
      { src: "assets/projects/surveyor3/01.jpg",
        alt: { en: "Comic cover: the Surveyor 3 lander on the Moon with Earth in the sky. Title: Surveyor 3, Lunar Encounter.", uk: "Обкладинка коміксу: апарат Surveyor 3 на Місяці, у небі Земля. Назва: «Зустріч на Місяці»." } },
      { src: "assets/projects/surveyor3/02.jpg",
        alt: { en: "The Surveyor 3 lander touches down on the Moon. 20 April 1967, Ocean of Storms.", uk: "Апарат Surveyor 3 сідає на Місяць. 20 квітня 1967, Океан Бур." } },
      { src: "assets/projects/surveyor3/03.jpg",
        alt: { en: "Surveyor 3's robotic arm digs four trenches in the lunar soil. A card says the soil bearing strength is confirmed: solid enough for Apollo.", uk: "Маніпулятор Surveyor 3 риє чотири траншеї в місячному ґрунті. На картці: несуча здатність ґрунту підтверджена, ґрунт достатньо твердий для Apollo." } },
      { src: "assets/projects/surveyor3/04.jpg",
        alt: { en: "Surveyor 3 beams pictures to Earth while engineers study a strip of lunar photographs. 6,326 images transmitted.", uk: "Surveyor 3 передає знімки на Землю, а інженери вивчають стрічку місячних фото. Надіслано 6 326 знімків." } },
      { src: "assets/projects/surveyor3/05.jpg",
        alt: { en: "The frosted lander in the cold dark of the lunar night. 4 May 1967: signal lost.", uk: "Заморожений апарат у холодній темряві місячної ночі. 4 травня 1967: зв'язок втрачено." } },
      { src: "assets/projects/surveyor3/06.jpg",
        alt: { en: "Two Apollo 12 astronauts walk toward Surveyor 3, which sits in a crater. Their lunar module stands 180 metres away. November 1969.", uk: "Двоє астронавтів Apollo 12 ідуть до Surveyor 3, що стоїть у кратері. Їхній місячний модуль стоїть за 180 метрів. Листопад 1969." } },
      { src: "assets/projects/surveyor3/07.jpg",
        alt: { en: "An astronaut carries a bag with about 10 kilograms of Surveyor 3 parts, a camera and a scoop. The rest of the lander stays behind on the Moon.", uk: "Астронавт несе сумку з близько 10 кілограмами деталей Surveyor 3: камерою та ківшем. Решта апарата лишається на Місяці." } }
    ]
  };

  var TXT = {
    prev: { en: "Previous page", uk: "Попередня сторінка" },
    next: { en: "Next page", uk: "Наступна сторінка" },
    page: { en: "Page {n} of {total}", uk: "Сторінка {n} з {total}" },
    error: { en: "This page could not be loaded", uk: "Не вдалося завантажити сторінку" },
    book: { en: "Comic book", uk: "Комікс" }
  };

  var CHEVRON_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var CHEVRON_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function pk(v){
    if (window.pick) return window.pick(v);
    return v && typeof v === "object" ? (v.en || "") : (v || "");
  }
  function el(tag, cls){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }
  function fmt(v, n, total){
    return pk(v).replace("{n}", n).replace("{total}", total);
  }

  window.STUDENT_PROJECTS["surveyor3"] = {
    title: CONTENT.title,
    type: "comic",
    init: function(container){
      var pages = CONTENT.pages, total = pages.length, current = 0;
      var prevAspect = container.style.aspectRatio;
      container.innerHTML = "";
      container.style.aspectRatio = "auto";

      var root = el("div", "comic");
      var book = el("div", "cm-book");
      book.tabIndex = 0;
      book.setAttribute("role", "group");
      book.setAttribute("aria-roledescription", "book");

      var pageEls = [], imgs = [], errs = [];
      pages.forEach(function(p, i){
        var page = el("div", "cm-page");
        page.style.zIndex = String(total - i);
        var front = el("div", "cm-face cm-front");
        var img = document.createElement("img");
        img.draggable = false;
        img.decoding = "async";
        var err = el("div", "cm-err");
        err.hidden = true;
        front.appendChild(img);
        front.appendChild(err);
        var back = el("div", "cm-face cm-back");
        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);
        pageEls.push(page);
        imgs.push(img);
        errs.push(err);
      });

      var bar = el("div", "cm-bar");
      var prev = el("button", "cm-btn");
      prev.type = "button";
      prev.innerHTML = CHEVRON_L;
      var count = el("span", "cm-count");
      var next = el("button", "cm-btn");
      next.type = "button";
      next.innerHTML = CHEVRON_R;
      bar.appendChild(prev);
      bar.appendChild(count);
      bar.appendChild(next);

      var note = el("p", "cm-note");
      var status = el("div", "cm-sr");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");

      root.appendChild(book);
      root.appendChild(bar);
      root.appendChild(note);
      root.appendChild(status);
      container.appendChild(root);

      function loadPage(i){
        if (i < 0 || i >= total) return;
        var img = imgs[i];
        if (img.getAttribute("src")) return;
        img.onerror = function(){
          img.style.visibility = "hidden";
          errs[i].hidden = false;
          errs[i].textContent = pk(TXT.error);
        };
        img.src = pages[i].src;
      }

      function render(announce){
        pageEls.forEach(function(p, i){
          p.classList.toggle("is-flipped", i < current);
          p.setAttribute("aria-hidden", i === current ? "false" : "true");
          imgs[i].alt = pk(pages[i].alt);
        });
        prev.disabled = current === 0;
        next.disabled = current === total - 1;
        count.textContent = (current + 1) + " / " + total;
        if (announce) status.textContent = fmt(TXT.page, current + 1, total) + ". " + pk(pages[current].alt);
      }

      function setTexts(){
        prev.setAttribute("aria-label", pk(TXT.prev));
        next.setAttribute("aria-label", pk(TXT.next));
        book.setAttribute("aria-label", pk(CONTENT.title) + " — " + pk(TXT.book));
        note.textContent = pk(CONTENT.note);
        errs.forEach(function(e, i){ if (!e.hidden) e.textContent = pk(TXT.error); });
        render(false);
      }

      function go(delta){
        var n = Math.max(0, Math.min(total - 1, current + delta));
        if (n === current) return;
        current = n;
        loadPage(n - 1); loadPage(n); loadPage(n + 1); loadPage(n + 2);
        render(true);
      }

      var sx = 0, sy = 0, sid = null;
      function onDown(e){
        if (e.pointerType === "mouse" && e.button !== 0) return;
        sid = e.pointerId; sx = e.clientX; sy = e.clientY;
      }
      function onUp(e){
        if (sid === null || e.pointerId !== sid) return;
        sid = null;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? 1 : -1);
        } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          var r = book.getBoundingClientRect();
          go(e.clientX - r.left > r.width / 2 ? 1 : -1);
        }
      }
      function onCancel(){ sid = null; }
      function onPrev(){ go(-1); }
      function onNext(){ go(1); }
      function onKey(e){
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        var t = e.target;
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }

      book.addEventListener("pointerdown", onDown);
      book.addEventListener("pointerup", onUp);
      book.addEventListener("pointercancel", onCancel);
      prev.addEventListener("click", onPrev);
      next.addEventListener("click", onNext);
      document.addEventListener("keydown", onKey);
      var offLang = window.onLangChange ? window.onLangChange(setTexts) : null;

      loadPage(0); loadPage(1); loadPage(2);
      setTexts();

      return function cleanup(){
        document.removeEventListener("keydown", onKey);
        book.removeEventListener("pointerdown", onDown);
        book.removeEventListener("pointerup", onUp);
        book.removeEventListener("pointercancel", onCancel);
        prev.removeEventListener("click", onPrev);
        next.removeEventListener("click", onNext);
        if (offLang) offLang();
        container.style.aspectRatio = prevAspect || "";
        container.innerHTML = "";
      };
    }
  };
})();
