/*
  Silent Explorers — language support (English / Українська).

  Plain JavaScript, no libraries, no network. Load this file BEFORE every other
  script of the page. What it gives you:

    window.I18N                    { en: {...}, uk: {...} } — interface strings
    window.t(key, params)          translated string; {name} placeholders are filled from params
    window.pick(value)             a string stays as it is; { en, uk } becomes the current language
                                   (falls back to English, then to any other language)
    window.onLangChange(fn)        fn(lang) runs after every language switch; returns an "unsubscribe" function
    window.getLang()               "en" | "uk"
    window.setLang(lang, opts)     switch language (opts.persist = remember the choice)
    window.addStrings({en,uk})     add or override interface strings from another script
    window.localizeItem(item)      the text fields of a DATA object (name, short, kind, voice, facts, why, note)
                                   in the current language, taken from window.I18N_OBJECTS (js/i18n-objects.js)

  Which language is used at start (first match wins):
    ?lang=uk | ?lang=en in the address  ->  saved choice (localStorage "silent-explorers:lang")
    ->  navigator.language starting with "uk"  ->  English.

  Plurals: t("key", { n: 5 }) looks for "key.one" / "key.few" / "key.many" / "key.other"
  (Intl.PluralRules of the current language), then for plain "key". The number that picks the
  form is params.count if given, otherwise params.n.

  Static markup in index.html is translated through data attributes:
    data-i18n="key"                      sets textContent
    data-i18n-html="key"                 sets innerHTML (the string is trusted: it comes from this file)
    data-i18n-attr="aria-label:key;alt:key2"   sets attributes
  Add ?i18ndebug=1 (e.g. ?lang=uk&i18ndebug=1) to list missing keys in the console.
*/
(function(){
  var STORE_KEY = "silent-explorers:lang";

  // ---------------------------------------------------------------------
  //  Interface strings. Keys: area.thing. A value may hold simple markup
  //  (<b>, <strong>, <code>) only where it is set with innerHTML.
  // ---------------------------------------------------------------------
  var I18N = {
    en: {
      "meta.title": "Silent Explorers",
      "meta.description": "Interactive 3D map of abandoned NASA and Soviet hardware on the Moon and Mars — with room for student-built mini-projects at every landing site.",
      "a11y.skip": "Skip to the list of machines",
      "hero.aria": "Globe",
      "globe.fallback": "The 3D globe can't run on this device. Use the list of machines below.",
      "globe.loading": "Loading the globe…",
      "brand.eyebrow": "Abandoned but Not Forgotten",
      "brand.title": "Silent Explorers",
      "brand.invite": "Spin the planet. Find the machines we left behind.",
      "lang.group": "Language",
      "lang.name.en": "English",
      "lang.name.uk": "Українська",
      "found.counter": "Found <b>{n}</b> of {total}",
      "found.of": "{n} of {total} found",
      "progress.aria.one": "Found {n} of {total} machine.",
      "progress.aria.other": "Found {n} of {total} machines.",
      "progress.aria.list": "Go to the list of machines",
      "progress.aria.badge": "Show your explorer badge",
      "hint.drag": "Drag to spin",
      "hint.tap": "Tap a light",
      "zoom.in": "Zoom in",
      "zoom.out": "Zoom out",
      "world.group": "Choose a world",
      "world.moon": "Moon",
      "world.mars": "Mars",
      "nav.all": "All machines",
      "collection.title.moon": "Moon collection",
      "collection.title.mars": "Mars collection",
      "collection.sub": "Every card is a real machine that is still out there. Open one to hear its story.",
      "state.new": "Not found yet",
      "state.seen": "Visited",
      "legend.project": "Has a student animation, mini-game or video",
      "collection.caption": "Positions use each mission's real landing coordinates on a stylized surface.",
      "about.summary": "About this project and how to add your own",
      "about.p1": "Every glowing point on this globe is a real machine NASA (or its partners) sent to the Moon or Mars — and never brought home. Drag to look around, then tap a marker to hear its story, see its last photo, and read what it really did.",
      "about.badge.ages": "Built for ages 10–14",
      "about.badge.missions.one": "{n} real mission, 1960s–2020s",
      "about.badge.missions.other": "{n} real missions, 1960s–2020s",
      "about.badge.coords": "Approximate real landing coordinates",
      "about.p2": "<strong>About this project.</strong> Made for NASA Space Apps Challenge 2026 — \"Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars.\" Dates, mission durations, and outcomes are drawn from public NASA/JPL mission records. Photos are public-domain NASA imagery. First-person narration is a storytelling device; it dramatizes real events rather than inventing new ones.",
      "about.p3": "One documented myth is corrected on purpose: Opportunity's famous \"my battery is low and it's getting dark\" line was never an actual transmission from the rover — see its card for what was really sent.",
      "about.p4": "<strong>Student projects.</strong> Each marker can carry its own small animation, mini-game or short video, made by a different student, instead of the plain photo. Eagle, Opportunity and Perseverance's parachute already have one each as examples — every other marker is open for someone to claim. A project is just a short script following a fixed contract (an <code>init(container)</code> function that draws into a box and returns a cleanup function); a finished MP4 clip needs only a few lines. Ask a mentor to add yours once it's ready.",
      "about.reset": "Reset my progress",
      "footer.text": "Silent Explorers · NASA Space Apps Challenge 2026 · Photos: NASA (public domain). Your progress is saved only in this browser.",
      "reward.title": "Explorer badge earned",
      "reward.body": "You found every silent explorer on the Moon and Mars. They are still out there — and now they are not forgotten.",
      "reward.keep": "Keep exploring",
      "reward.reset": "Start over",
      "reward.live": "Explorer badge earned. You found all {total} machines.",
      "live.found": "Found {n} of {total}.",
      "live.reset": "Progress reset.",
      "panel.aria": "Mission story",
      "panel.aria.named": "Mission story: {name}",
      "panel.close": "Close",
      "panel.says": "says:",
      "panel.kind.moon": "Lunar hardware",
      "panel.kind.mars": "Martian hardware",
      "panel.new": "New find · {n} of {total}",
      "panel.log": "Mission log",
      "panel.why": "Why it mattered",
      "panel.photo.alt": "NASA photo related to {name}",
      "project.slot": "Open slot for your project",
      "project.ref": "Showing the NASA reference photo",
      "project.byline": "Student project: “{title}” by {author}",
      "project.failed": "This project failed to load",
      "type.animation": "Animation",
      "type.game": "Mini-game",
      "type.video": "Video",
      "invite.title": "This spot is waiting for your project",
      "invite.text": "No student project yet — this could be yours. Make a small animation, mini-game or short video about {name}, and it will play here instead of the photo.",
      "invite.how": "How to add yours",
      "next.label": "Next machine to find",
      "next.stop": "Next stop: {world}",
      "tip.project": "Student project inside",
      "card.project": "Student project",
      "cmp.times": "About {n}× longer than planned",
      "video.note": "Artist's reconstruction — not NASA footage",
      "video.title": "Video",
      "video.play": "Play video with sound",
      "video.aria": "{title} — student video",
      "video.error": "This video could not be loaded"
    }
  };
  // The Ukrainian strings are in js/i18n.uk.js (loaded right after this file).

  I18N.uk = I18N.uk || {};
  window.I18N = I18N;
  window.I18N_OBJECTS = window.I18N_OBJECTS || {};

  var SUPPORTED = ["en", "uk"];
  var lang = "en";
  var listeners = [];
  var missing = {};         // lang -> { key: true }, filled when i18ndebug is on
  var debug = false;
  var rulesCache = {};

  function qParam(name){
    try { return new URLSearchParams(window.location.search).get(name); } catch(e){ return null; }
  }
  debug = qParam("i18ndebug") === "1";

  function detect(){
    var q = (qParam("lang") || "").toLowerCase();
    if (SUPPORTED.indexOf(q) >= 0) return q;
    try {
      var s = window.localStorage.getItem(STORE_KEY);
      if (SUPPORTED.indexOf(s) >= 0) return s;
    } catch(e){ /* storage blocked: ignore */ }
    var nav = String(navigator.language || "").toLowerCase();
    if (nav.indexOf("uk") === 0) return "uk";
    return "en";
  }

  function rules(l){
    if (!rulesCache[l]){
      try { rulesCache[l] = new Intl.PluralRules(l); }
      catch(e){ rulesCache[l] = { select: function(n){ return n === 1 ? "one" : "other"; } }; }
    }
    return rulesCache[l];
  }

  function lookup(l, key, count){
    var d = I18N[l];
    if (!d) return undefined;
    if (count !== undefined && !isNaN(count)){
      var cat = rules(l).select(count);
      if (d[key + "." + cat] !== undefined) return d[key + "." + cat];
      if (d[key + ".other"] !== undefined) return d[key + ".other"];
    }
    return d[key];
  }

  function fill(str, params){
    if (!params) return str;
    return String(str).replace(/\{(\w+)\}/g, function(m, k){
      return params[k] !== undefined && params[k] !== null ? params[k] : m;
    });
  }

  function t(key, params){
    var count;
    if (params){
      if (params.count !== undefined) count = Number(params.count);
      else if (params.n !== undefined) count = Number(params.n);
    }
    var s = lookup(lang, key, count);
    if (s === undefined && lang !== "en"){
      if (debug){ (missing[lang] = missing[lang] || {})[key] = true; }
      s = lookup("en", key, count);
    }
    if (s === undefined){
      if (debug){ (missing.en = missing.en || {})[key] = true; }
      s = key;
    }
    return fill(s, params);
  }

  function pick(value){
    if (value === undefined || value === null) return "";
    if (typeof value !== "object") return value;
    if (value[lang] !== undefined && value[lang] !== "") return value[lang];
    if (value.en !== undefined) return value.en;
    for (var k in value){ if (Object.prototype.hasOwnProperty.call(value, k)) return value[k]; }
    return "";
  }

  // ---------- translated text of the DATA objects (js/i18n-objects.js) ----------
  function localizeItem(item){
    var tr = (window.I18N_OBJECTS && window.I18N_OBJECTS[lang] && window.I18N_OBJECTS[lang][item.id]) || null;
    var used = "en";
    var out = {
      id: item.id, name: item.name, kind: item.kind, voice: item.voice,
      facts: item.facts, why: item.why, note: item.note
    };
    if (tr){
      used = lang;
      ["name", "kind", "voice", "why", "note"].forEach(function(f){ if (tr[f]) out[f] = tr[f]; });
      if (tr.facts && tr.facts.length === item.facts.length) out.facts = tr.facts;
      else if (tr.facts && debug){ (missing[lang] = missing[lang] || {})["objects." + item.id + ".facts (length differs)"] = true; }
    } else if (lang !== "en" && debug){
      (missing[lang] = missing[lang] || {})["objects." + item.id] = true;
    }
    out.short = (tr && tr.short) || out.name.split(" — ")[0];
    out.lang = used;
    return out;
  }

  // ---------- static markup ----------
  function applyStatic(root){
    root = root || document;
    var i, el, list;
    list = root.querySelectorAll("[data-i18n]");
    for (i = 0; i < list.length; i++){ el = list[i]; el.textContent = t(el.getAttribute("data-i18n")); }
    list = root.querySelectorAll("[data-i18n-html]");
    for (i = 0; i < list.length; i++){ el = list[i]; el.innerHTML = t(el.getAttribute("data-i18n-html")); }
    list = root.querySelectorAll("[data-i18n-attr]");
    for (i = 0; i < list.length; i++){
      el = list[i];
      el.getAttribute("data-i18n-attr").split(";").forEach(function(pair){
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    }
    // language switchers (there is one in the header and one in the card)
    list = root.querySelectorAll("[data-lang]");
    for (i = 0; i < list.length; i++){
      list[i].setAttribute("aria-pressed", list[i].getAttribute("data-lang") === lang ? "true" : "false");
    }
  }

  function applyDocument(){
    var root = document.documentElement;
    root.setAttribute("lang", lang);
    document.title = t("meta.title");
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));
  }

  function updateUrlParam(){
    // keep a shared link honest: if the address says ?lang=..., it follows the switch
    try {
      var u = new URL(window.location.href);
      if (u.searchParams.has("lang")){
        u.searchParams.set("lang", lang);
        window.history.replaceState(null, "", u.toString());
      }
    } catch(e){ /* ignore */ }
  }

  function setLang(next, opts){
    if (SUPPORTED.indexOf(next) < 0) return;
    var changed = next !== lang;
    lang = next;
    if (opts && opts.persist){
      try { window.localStorage.setItem(STORE_KEY, lang); } catch(e){ /* ignore */ }
      updateUrlParam();
    }
    if (!changed && !(opts && opts.force)) return;
    applyDocument();
    applyStatic(document);
    listeners.slice().forEach(function(fn){
      try { fn(lang); } catch(e){ if (window.console && console.error) console.error(e); }
    });
  }

  function onLangChange(fn){
    if (typeof fn !== "function") return function(){};
    listeners.push(fn);
    return function(){
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function addStrings(dict){
    Object.keys(dict || {}).forEach(function(l){
      I18N[l] = I18N[l] || {};
      Object.keys(dict[l]).forEach(function(k){ I18N[l][k] = dict[l][k]; });
    });
  }

  // ---------- debug report ----------
  function report(){
    if (!debug || !window.console) return;
    var lines = [];
    SUPPORTED.forEach(function(l){
      if (l === "en") return;
      // a plural family ("key.one", "key.other", or plain "key") counts as present if any of its forms exists
      var forms = ["", ".zero", ".one", ".two", ".few", ".many", ".other"];
      var base = function(k){ return k.replace(/\.(zero|one|two|few|many|other)$/, ""); };
      var has = function(d, b){ return forms.some(function(f){ return d[b + f] !== undefined; }); };
      var seen = {}, absent = [];
      Object.keys(I18N.en).forEach(function(k){
        var b = base(k);
        if (seen[b]) return;
        seen[b] = true;
        if (!has(I18N[l], b)) absent.push(b);
      });
      Object.keys(missing[l] || {}).forEach(function(k){ if (absent.indexOf(k) < 0) absent.push(k); });
      if (absent.length) lines.push("[i18n] missing in \"" + l + "\" (" + absent.length + "): " + absent.join(", "));
      var objs = window.I18N_OBJECTS && window.I18N_OBJECTS[l];
      var ids = (window.I18N_ITEM_IDS || []);
      var noObj = ids.filter(function(id){ return !objs || !objs[id]; });
      if (noObj.length) lines.push("[i18n] objects without \"" + l + "\" text: " + noObj.join(", "));
    });
    if (missing.en) lines.push("[i18n] keys missing everywhere: " + Object.keys(missing.en).join(", "));
    if (!lines.length) lines.push("[i18n] no missing keys");
    lines.forEach(function(s){ console.warn(s); });
  }

  window.t = t;
  window.pick = pick;
  window.onLangChange = onLangChange;
  window.getLang = function(){ return lang; };
  window.setLang = setLang;
  window.addStrings = addStrings;
  window.localizeItem = localizeItem;
  window.I18N_report = report;

  // the user clicks a switcher button (any element with data-lang)
  document.addEventListener("click", function(e){
    var b = e.target && e.target.closest ? e.target.closest("[data-lang]") : null;
    if (b) setLang(b.getAttribute("data-lang"), { persist: true });
  });

  // Choose the language now. The markup is translated by I18N_refresh(), which
  // js/i18n.uk.js calls once the Ukrainian strings are loaded (and again on DOMContentLoaded).
  lang = detect();
  document.documentElement.setAttribute("lang", lang);
  window.I18N_refresh = function(){ applyDocument(); applyStatic(document); };
  window.addEventListener("load", function(){ setTimeout(report, 300); });
  document.addEventListener("DOMContentLoaded", window.I18N_refresh);
})();
