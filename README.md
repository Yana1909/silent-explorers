# Silent Explorers

Interactive 3D map of real NASA and Soviet hardware abandoned on the Moon and Mars — built for the NASA Space Apps Challenge ["Abandoned but not Forgotten"](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

Drag the globe, switch between Moon and Mars, and tap a marker to open a card: a NASA photo, a first-person account of the hardware, and the verified mission facts behind it.

## Student projects

Each marker is also a slot for a short animation, mini-game or video made by a student, which replaces the static photo when attached. Three examples ship with the project:

- **Eagle** (`projects/eagle.js`) — a looping canvas animation of the Apollo 11 descent and landing.
- **Opportunity** (`projects/opportunity.js`) — "Пилова буря", a mini-game about surviving a Martian dust storm.
- **Perseverance's Parachute & Backshell** (`projects/perseverance-debris.js`) — "Сім хвилин до Марса", a video clip (artist's reconstruction, not NASA footage).

The other six locations (Lunokhod 2, LRV-17, Surveyor 3, Spirit, Viking 1, InSight) are open for new submissions.

### Adding your own project

A project is a single `.js` file that registers itself in a global object:

```js
window.STUDENT_PROJECTS['<location id>'] = {
  title: "Project name",
  author: "Your name",
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
     id: "<location-id>", title: "Clip name", author: "Your name",
     src: "assets/video/<location-id>.mp4", poster: "assets/video/<location-id>.jpg",
     note: "Artist's reconstruction — not NASA footage"
   });
   ```

   Keep the `note` honest: if the clip is your own drawing or AI-generated, it must say it is not NASA footage.

3. Add `<script src="projects/<location-id>.js"></script>` in `index.html` after `projects/_video.js`.

The clip waits for a tap on the play button and then plays with sound; portrait and landscape clips both fit. All the playback logic is in `projects/_video.js` — you don't need to change it.

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
projects/              Student project modules (see above)
  _template.js         Starter for a canvas animation or mini-game
  _video.js            Shared helper for video projects (createVideoProject)
assets/img/            NASA mission photographs (public domain)
assets/video/          Student video clips and their poster frames
docs/                  Design brief and design notes
```

## Credits

Mission photographs courtesy of [NASA's image API](https://images.nasa.gov) (public domain). The Perseverance parachute and backshell photo is PIA25217 (NASA/JPL-Caltech, taken by the Ingenuity helicopter).

The video in `assets/video/` is a student's artist's reconstruction, not NASA footage.
