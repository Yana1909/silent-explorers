# Silent Explorers

Interactive 3D map of real NASA and Soviet hardware abandoned on the Moon and Mars — built for the NASA Space Apps Challenge ["Abandoned but not Forgotten"](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

Drag the globe, switch between Moon and Mars, and tap a marker to open a card: a NASA photo, a first-person account of the hardware, and the verified mission facts behind it.

## Student projects

Each marker is also a slot for a short animation or mini-game made by a student, which replaces the static photo when attached. Two examples ship with the project:

- **Eagle** (`projects/eagle.js`) — a looping canvas animation of the Apollo 11 descent and landing.
- **Opportunity** (`projects/opportunity.js`) — "Пилова буря", a mini-game about surviving a Martian dust storm.

The other six locations (Lunokhod 2, LRV-17, Surveyor 3, Spirit, Viking 1, InSight) are open for new submissions.

### Adding your own project

A project is a single `.js` file that registers itself in a global object:

```js
window.STUDENT_PROJECTS['<location id>'] = {
  title: "Project name",
  author: "Your name",
  type: "animation" | "game",
  init(container, item) {
    // build your canvas/DOM inside `container` (already sized ~16:10),
    // start your loop or game,
    // return a cleanup() function that stops timers and removes listeners.
  }
};
```

Location ids: `eagle`, `lunokhod2`, `lrv17`, `surveyor3`, `opportunity`, `spirit`, `viking1`, `insight`.

1. Copy `projects/eagle.js` as a starting template.
2. Save your file as `projects/<location-id>.js`.
3. Add `<script src="projects/<location-id>.js"></script>` next to the other project `<script>` tags in `index.html`, right before the main `<script>` block.

## Running locally

No build step — it's a static page. Any static file server works, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

```
index.html            Main page: globe, panel UI, mission data
projects/              Student project modules (see above)
assets/img/            NASA mission photographs (public domain)
```

## Credits

Mission photographs courtesy of [NASA's image API](https://images.nasa.gov) (public domain).
