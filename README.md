# Cat Scratch

Open-World-Katzenchaos im Browser: Du spielst **Timmi Tatz**, eine Katze mit Krallen und Hunger. Gebaut mit React, React Three Fiber (three.js) und Rapier-Physik.

Konzept: [docs/CONCEPT.md](docs/CONCEPT.md)

## Prototyp-Stand
- Third-Person-Katze mit Maus-Kamera, Sprinten und Doppelsprung
- Kratzangriff (Linksklick) richtet die Katze nach der Kamera aus, stößt Objekte um und verletzt Gegner
- Wachhunde mit Verfolgung, Biss, Rückstoß und Treffer-/Todeseffekt (Splatter oder Sterne)
- Leben (Herzen), Unverwundbarkeit nach Treffer, Game-Over mit Respawn
- Klettern: mit W gegen kletterbare Wände laufen (Hausaußenwände, Kratzpfosten), oben läuft die Katze selbst auf die Fläche
- Vier Missionen mit TTS-Erzähler und Untertiteln (Gegenstände umwerfen, Hunde besiegen, goldene Fischgräten sammeln, Napf erreichen) samt Siegbildschirm
- Chaos-Meter und Kill-Zähler
- Kleine Testwelt (Haus, Zaun, Bäume, Kisten, Fässer, Vasen)
- TTS-Erzähler (Web Speech API), Splatter-Schalter (Taste `B`)

## Steuerung
WASD bewegen · W gegen Wand klettern · Shift sprinten · Leertaste springen (2×) · Linksklick kratzen · B Splatter an/aus · Esc Maus freigeben

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
