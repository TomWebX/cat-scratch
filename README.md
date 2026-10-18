# Cat Scratch

Open-World-Katzenchaos im Browser: Du spielst **Timmi Tatz**, eine Katze mit Krallen und Hunger. Gebaut mit React, React Three Fiber (three.js) und Rapier-Physik.

Konzept: [docs/CONCEPT.md](docs/CONCEPT.md)

## Prototyp-Stand
- Third-Person-Katze mit Maus-Kamera, Sprinten und Doppelsprung
- Kratzangriff (Linksklick) stößt physikalische Objekte um und füllt das Chaos-Meter
- Kleine Testwelt (Haus, Zaun, Bäume, Kisten, Fässer, Vasen)
- TTS-Erzähler (Web Speech API), Splatter-Schalter (Taste `B`)

## Steuerung
WASD bewegen · Shift sprinten · Leertaste springen (2×) · Linksklick kratzen · B Splatter an/aus · Esc Maus freigeben

## Entwicklung
```bash
npm install
npm run dev      # lokaler Dev-Server
npm test         # Unit-Tests (Vitest)
npm run build    # Produktions-Build nach dist/
```

## Deployment (GitHub Pages)
Der Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) baut und veröffentlicht bei jedem Push auf `main`.
Einmalig im Repository: **Settings → Pages → Source: GitHub Actions**.
Die Seite ist danach unter `https://tomwebx.github.io/cat-scratch/` erreichbar.
