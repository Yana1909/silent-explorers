# Silent Explorers

Interactive 3D map of real NASA and Soviet hardware abandoned on the Moon and Mars — built for the NASA Space Apps Challenge ["Abandoned but not Forgotten"](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

Drag the globe, switch between Moon and Mars, and tap a marker to open a card: a NASA photo, a first-person account of the hardware, and the verified mission facts behind it.

## Student projects

Each marker is also a slot for a short animation, mini-game or video made by a student, which replaces the static photo when attached. Three examples ship with the project:

- **Eagle** (`projects/eagle.js`) — a 30-second animated reconstruction of the Apollo 11 landing (video).
- **Opportunity** (`projects/opportunity.js`) — "Пилова буря", a mini-game about surviving a Martian dust storm.
- **Perseverance's Parachute & Backshell** (`projects/perseverance-debris.js`) — "Seven Minutes to Mars" / "Сім хвилин до Марса", a video clip (artist's reconstruction, not NASA footage).

The other six locations (Lunokhod 2, LRV-17, Surveyor 3, Spirit, Viking 1, InSight) are open for new submissions.

### Adding your own project

A project is a single `.js` file that registers itself in a global object:

```js
window.STUDENT_PROJECTS['<location id>'] = {
  title: "Project name",      // a string, or { en: "Project name", uk: "Назва проєкту" }
  author: "Your name",        // a string, or { en, uk }
  type: "animation" | "game" | "video",
  init(container, item) {
    // build your canvas/DOM inside `container` (already sized ~16:10),
    // start your loop or game,
    // return a cleanup() function that stops timers and removes listeners.
  }
};
```

Location ids: `eagle`, `lunokhod2`, `lrv17`, `surveyor3`, `opportunity`, `spirit`, `viking1`, `insight`, `perseverance-debris`.

#### An animation or a mini-game

1. Copy `projects/_template.js` (a commented canvas starter with a correct `cleanup`).
2. Save your copy as `projects/<location-id>.js` and write the same id into `LOCATION_ID` at the top — until you do, the file registers nothing.
3. Add `<script src="projects/<location-id>.js"></script>` next to the other project `<script>` tags in `index.html`, right before the main `<script>` block.

#### I have a finished MP4

1. Compress the clip into `assets/video/<location-id>.mp4` (H.264 + AAC, starts playing before it is fully downloaded; aim for 8 MB or less — raise `-crf` to make the file smaller):

   ```bash
   ffmpeg -i my-clip.mp4 -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart assets/video/<location-id>.mp4
   ```

   Then save one frame as the poster (here, the frame at 5 seconds):

   ```bash
   ffmpeg -ss 5 -i assets/video/<location-id>.mp4 -frames:v 1 -q:v 4 assets/video/<location-id>.jpg
   ```

2. Create `projects/<location-id>.js` with these lines:

   ```js
   window.createVideoProject({
     id: "<location-id>",
     title: { en: "Clip name", uk: "Назва відео" },   // a plain string works too
     author: "Your name",
     src: "assets/video/<location-id>.mp4", poster: "assets/video/<location-id>.jpg",
     note: { en: "Artist's reconstruction — not NASA footage", uk: "Художня реконструкція, а не відео NASA" }
   });
   ```

   Keep the `note` honest: if the clip is your own drawing or AI-generated, it must say it is not NASA footage. If you leave `note` out, the standard bilingual note is shown.

3. Add `<script src="projects/<location-id>.js"></script>` in `index.html` after `projects/_video.js`.

The clip waits for a tap on the play button and then plays with sound; portrait and landscape clips both fit. All the playback logic is in `projects/_video.js` — you don't need to change it.

## Language

The site speaks **English** and **Українська**. Switch with the **EN | УК** buttons in the header (and in the story card, so you can change language without closing it). The switch is instant, no reload: the text of an open card is redrawn but the student project inside it (video, game, animation) keeps running.

Which language opens first: `?lang=uk` or `?lang=en` in the address, then the choice saved in this browser (`localStorage` key `silent-explorers:lang`), then the browser language (`uk…` gives Ukrainian), then English. A shared link such as `index.html?lang=uk` always opens in Ukrainian. Add `&i18ndebug=1` to list missing translations in the console.

How it is built (plain JavaScript, no libraries, no build step; all files are loaded before the other scripts):

- `js/i18n.js` — the engine and the English interface strings (`window.I18N.en`): `t(key, params)`, `pick(value)`, `onLangChange(fn)`, `getLang()`, `setLang()`, `addStrings()`, `localizeItem()`.
- `js/i18n.uk.js` — the Ukrainian interface strings (same keys).
- `js/i18n-objects.js` — the Ukrainian texts of the nine objects (name, kind, first-person story, facts, "why it mattered", note) plus the translation glossary. The English originals stay in `DATA` in `index.html`.

### Add or change an interface string

1. Add the key to `I18N.en` in `js/i18n.js` and to `I18N.uk` in `js/i18n.uk.js`. Keys are `area.thing`; use `{name}` placeholders, never glue sentences together from pieces (word order differs between languages).
2. In `index.html` markup use `data-i18n="key"` (text), `data-i18n-html="key"` (text with `<b>`/`<code>`), or `data-i18n-attr="aria-label:key;alt:other.key"`. In script use `t("key", { name: "…" })`. If the text is built by script, redraw it inside `renderLang()` (it runs after every switch).
3. Plurals: define `key.one`, `key.few`, `key.many`, `key.other` (Ukrainian) or `key.one`, `key.other` (English) and call `t("key", { n: 5 })`; the form is chosen by `Intl.PluralRules`. If a different number must choose the form, pass it as `count`.

### Add an object (or another language) for the globe

Add the object to `DATA` in `index.html` as before (English), then add an entry with the same `id` to `I18N_OBJECTS.uk` in `js/i18n-objects.js`: `name`, `short` (the speaker's short name), `kind`, `voice`, `facts` (same length and order as the English list), `why`, and `note` if the English one has it. Anything missing falls back to English. Follow the glossary at the top of that file.

### Two languages in a student project

- Titles, authors, notes and alt texts may be a plain string or `{ en: "…", uk: "…" }`; the page resolves them with `pick()`.
- Inside your own `init()`, use `pick({ en: "Battery", uk: "Батарея" })` for text drawn on the canvas or in your own HTML, and `window.onLangChange(function(lang){ … })` to refresh it when the language is switched (it returns a function that removes the listener; call it in your `cleanup`). Do not rebuild your whole project in that callback: the card does not restart on a language switch, and neither should your project.
- Shared strings are available through `t("key")`; add your own with `addStrings({ en: { "myproject.hint": "Hold to shield" }, uk: { "myproject.hint": "Тримай, щоб захиститися" } })`.
- Helpers that build a project for you (video today, comic, diary and diagram later) accept the same `string | { en, uk }` values.

## Running locally

No build step — it's a static page. Any static file server works, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```
index.html            Main page: markup, mission data, globe and panel logic
css/styles.css        All styles (colours and fonts are CSS variables in :root)
js/                    Language support (see "Language")
  i18n.js              Engine + English interface strings: t(), pick(), onLangChange()
  i18n.uk.js           Ukrainian interface strings
  i18n-objects.js      Ukrainian texts of the nine objects + translation glossary
projects/              Student project modules (see above)
  _template.js         Starter for a canvas animation or mini-game
  _video.js            Shared helper for video projects (createVideoProject)
assets/img/            NASA mission photographs (public domain)
assets/video/          Student video clips and their poster frames
docs/                  Design brief, design notes, translation notes (I18N_NOTES.md)
```

## Credits

Mission photographs courtesy of [NASA's image API](https://images.nasa.gov) (public domain). The Perseverance parachute and backshell photo is PIA25217 (NASA/JPL-Caltech, taken by the Ingenuity helicopter).

The video in `assets/video/` is a student's artist's reconstruction, not NASA footage.
