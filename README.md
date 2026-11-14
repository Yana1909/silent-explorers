# Silent Explorers

Interactive 3D map of real hardware abandoned on the Moon and Mars, built for the NASA Space Apps Challenge 2026 ["Abandoned but not Forgotten"](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/).

Drag the globe, switch between the Moon and Mars, and tap a marker to open a card: a NASA photo, a first-person story told by the machine itself, and the verified mission facts behind it. Some cards also hold a student project instead of a photo: a comic, a game or a video.

The site speaks English and Ukrainian (switch with the EN | УК buttons in the header).

## Run locally

No build step, it is a static page:

```bash
python -m http.server 8000 --protocol HTTP/1.1
```

Then open `http://localhost:8000`.

## Credits

Mission photographs: [NASA Image and Video Library](https://images.nasa.gov) (public domain). Mission facts are checked against NASA's NSSDCA catalog and science.nasa.gov mission pages. Some illustrations, comic pages and videos are AI-generated artist's reconstructions, not NASA footage, and are labelled as such.
