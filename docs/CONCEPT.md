# Cat Scratch – Spielkonzept

## 1. Pitch
Eine offene 3D-Welt im Browser, in der du eine ganz normale Hauskatze spielst, die durch ein Missverständnis mit ihrem Besitzer, einer Nachbarschaft voller Spinner und einer Verschwörung um das "goldene Thunfisch-Dosenöffner-Syndikat" in absurde Konflikte gerät. Statt einer Waffe hast du Krallen: Kratzen, Springen, Klettern, Chaos stiften – mit Slapstick-Gewalt (per Splatter-Schalter abschaltbar).

**Eckdaten**
| Punkt | Entscheidung |
|---|---|
| Genre | Open-World Third-Person Action-Comedy |
| Ton | Absurd-Comedy, Slapstick-Gewalt (Cartoon-Splatter, Federn, Fell, übertriebene Ragdolls) |
| Plattform | Desktop-Browser, Maus + Tastatur |
| Modus | Singleplayer |
| Umfang MVP | Vertical Slice: 1 Viertel, Kernmechaniken |
| Tech | React + React Three Fiber (three.js) + Rapier Physik |
| Assets | Low-Poly/Stylized, freie Assets (Kenney, Quaternius) |

## 2. Inspiration & Designprinzipien
Cat Scratch **orientiert sich in Stil, Spielkonzept und Spielwelt am Spiel *Squirrel with a Gun*** (kleines Tier als Hauptfigur in einer offenen, physikbasierten 3D-Welt aus Menschensicht, absurder Humor, Chaos). Die Orientierung beschränkt sich auf allgemeine, nicht schützbare Ideen und Genre-Konventionen. Es werden keine Inhalte, Namen, Figuren, Level, Assets, Dialoge oder Code übernommen; es besteht keine Verbindung zum Original (siehe Kapitel 10).

Übernommene Prinzipien:
- Third-Person, kleiner Held in großer Welt aus Menschensicht.
- Physikbasiertes Chaos: alles ist anstoßbar, zerstörbar, werfbar.
- Absurder Humor, schräge NPCs, Erzähler/Kommentare.
- Offene Spielwelt mit Missionen, Sammelobjekten und Geheimnissen.

Cat Scratch setzt auf ein **Nahkampf-/Kratz-System** und katzentypische Bewegung (Klettern, Springen, Balancieren, Durch-Lücken-Schlüpfen).

## 3. Spielwelt
**MVP-Level: "Whiskerville – Kleinstadt-Vorgarten-Viertel"**
- Reihenhaus-Siedlung mit Gärten, Zäunen, Dächern, Straße, kleinem Park und Markt.
- Vertikal gedacht: Boden, Zäune, Bäume, Dächer, Innenräume (1–2 begehbare Häuser).
- Tag/Nacht-Zyklus (später), Wetter optional.
- Bewohner: Menschen, Hunde, Vögel, Mäuse, Gartenzwerge, Roboter-Staubsauger.
- Spätere Viertel (Post-MVP): Innenstadt/Markt, Hafen, Industriegebiet, Zoo.

## 4. Kernmechaniken
### 4.1 Bewegung
- WASD, Maus-Kamera (Pointer Lock), Springen, Sprinten, Ducken/Schleichen.
- Katzen-Moves: Doppelsprung/Wandsprung, Klettern an Kletterflächen (Bäume, Kratzbäume, Zäune), Balancieren, Fallschaden-frei (immer auf den Pfoten).
- Optional "Zoomies" (kurzer Geschwindigkeits-Boost).

### 4.2 Kratzen (Hauptwaffe)
- **Linksklick: Kratzangriff** (schnelle Kombo, 3 Schläge, letzter mit Knockback).
- **Rechtsklick (halten): Aufgeladener Krallenhieb** (Flächenschaden, durchbricht Möbel/Türen).
- **Sprungangriff (Pounce)**: Sprung + Klick, hohes Impact-Gewicht.
- **Kratz-Spuren**: Möbel/Wände behalten sichtbare Kratzer (Decals) – wichtig fürs Feedback.
- Treffer-Feedback: Hitstop, Screen-Shake, Fellpartikel, Comic-Text ("FFFT!", "RIIIP!").
- Waffen-Upgrades (Krallen): Standard, Stahlkrallen, Laserkrallen, Gummikrallen (Humor), jeweils mit eigenen Effekten.

### 4.3 Physik & Zerstörung
- Rapier-Rigid-Bodies für Gegenstände (Vasen, Stühle, Mülltonnen, Gläser vom Tisch stoßen).
- Zerstörbare Objekte mit "Chaos-Punkten" als Belohnung.
- Ragdoll-Gegner mit übertriebenen Reaktionen.

### 4.4 Gesundheit & Ressourcen
- **Leben** (Herzen/Katzenleben: 9 Leben als Hardcore-Checkpoint-System).
- **Hunger/Energie** optional: Futter heilt, Thunfisch = Power-up.
- **Chaos-Meter**: Zerstörung füllt Meter → temporärer "Rage-Mode".

### 4.5 Gegner (MVP)
| Gegner | Verhalten |
|---|---|
| Wachhund | Verfolgt, beißt, wird vom Pounce betäubt |
| Nachbar mit Besen | Nahkampf, blockt frontal |
| Roboter-Staubsauger | Patrouille, Rammangriff |
| Krähen | Luftangriffe, Dive-Bombs |
| Boss: "Der Hundefänger" | Mehrphasen-Kampf mit Netz, Falle und Fahrzeug |

### 4.6 Missionen & Progression
- Hauptmissionen (Story) + Nebenaufgaben (Mäuse jagen, Gartenzwerge zerstören, Lieferungen).
- Sammelobjekte: goldene Fischgräten, versteckte Spielzeugmäuse.
- Unlockables: Hüte/Outfits, Krallen-Skins.
- Speicherstand per localStorage (später optional Cloud).

## 5. Story (MVP-Skizze)
Der Besitzer *Herr Müller* wird entführt (angeblich von der Dosenöffner-Mafia). Die Katze **Timmi Tatz** will primär ihr Abendessen, stolpert aber in eine Verschwörung. Ein trockener TTS-Erzähler kommentiert alles. Ziel: Futternapf zurückbekommen → Besitzer retten → Boss.

## 6. Stil & Präsentation
- **Visuell**: Stylized Low-Poly, kräftige Farben, weiche Schatten, Toon-/Cel-Shading optional.
- **Audio**: Humorvolle Soundeffekte, TTS-Erzähler (Web Speech API, mit Untertiteln), dynamische Musik (Chaos-Meter beeinflusst Intensität). Freie Quellen (z.B. Kenney, freesound mit CC0).
- **UI**: Cartoon-Comic-Look, Chaos-Meter, Herzen, Mini-Karte, Missionsziel.
- **Content-Hinweis**: Slapstick-Gewalt, Cartoon-Stil, Splatter-Schalter (Blut an/aus), ggf. Alterskennzeichnung.

## 7. Technische Architektur
### 7.1 Stack
- **Build**: Vite + TypeScript
- **UI/Rendering**: React, `@react-three/fiber`, `@react-three/drei`
- **Physik**: `@react-three/rapier` (WASM)
- **State**: Zustand (Spielzustand, Inventar, Missionen)
- **ECS (optional)**: `miniplex` für Gegner/Entities bei vielen Objekten
- **Animation**: GLTF-Animationen via drei `useAnimations`, AnimationMixer/State-Machine
- **Audio**: Howler.js oder three.js PositionalAudio
- **Tests**: Vitest (Spiellogik), Playwright (Smoke-Test)
- **Hosting**: GitHub Pages / Netlify / Vercel (statisch)

### 7.2 Projektstruktur (Vorschlag)
```
src/
  main.tsx, App.tsx
  game/
    core/        # Game Loop, State (Zustand), Events
    player/      # Controller, Kamera, Kratzsystem
    enemies/     # KI (Behavior Trees / FSM)
    world/       # Level, Chunks, Props, Zerstörung
    missions/    # Missions-Engine
    audio/
  ui/            # HUD, Menüs (React DOM)
  assets/        # GLTF, Texturen, Sounds
```

### 7.3 Performance-Strategie (Browser)
- Instancing für Props, LOD, Frustum-Culling.
- Draco/Meshopt-Komprimierung, KTX2-Texturen.
- Streaming per Chunk, Ladebildschirm mit Asset-Preloading.
- Physik nur für nahe Objekte aktiv (Sleeping, Distanz-Culling).
- Ziel: 60 FPS auf Mittelklasse-Laptops, Bundle < 15 MB initial.
- Kein React-State im Render-Loop; refs + `useFrame`.

### 7.4 Risiken
| Risiko | Gegenmaßnahme |
|---|---|
| Open World vs. Browser-Performance | Kleines Viertel, Chunking, Instancing |
| Charakter-Controller-Feel | Rapier Kinematic Character Controller, früh prototypen |
| Asset-Konsistenz (freie Assets) | Einheitliche Palette/Shader, Kenney/Quaternius priorisieren |
| Animationsaufwand | Mixamo/freie Tier-Rigs, Procedural Anims |
| Scope Creep | Strikter Vertical Slice |

## 8. Roadmap
1. **Prototyp (Wochen 1–2)**: Katze läuft/springt, Kamera, Grau-Box-Level, Rapier.
2. **Kratz-System (3–4)**: Kombo, Hit-Detection, Zerstörbare Props, Feedback.
3. **Welt (5–6)**: Viertel mit Assets, Klettern, Innenräume.
4. **Gegner & KI (7–8)**: Hund, Nachbar, Staubsauger.
5. **Missionen & Story (9–10)**: Missions-Engine, Erzähler, Sammelobjekte.
6. **Boss, Politur, Audio (11–12)**: Boss, UI, Performance, Deployment.

## 9. Definition of Done (MVP)
- Spielbar im Browser ohne Installation, ≥ 60 FPS auf Referenz-Hardware.
- 1 Viertel, 3–4 Missionen, 4 Gegnertypen + 1 Boss.
- Kratz-Kombos, Pounce, Charge-Attack, Zerstörungsphysik.
- Speichern/Laden, Pause-Menü, Einstellungen (Lautstärke, Sensitivität).

## 10. Entscheidungen & rechtliche Abgrenzung
- **Hauptfigur:** Kater/Katze **Timmi Tatz**.
- **Blut-Schalter:** Ja. Einstellung "Splatter" (Aus = Fell-/Sternchen-Effekte statt Blut), im Menü und beim ersten Start abgefragt.
- **Erzähler:** Text-to-Speech (Web Speech API `speechSynthesis`, deutsche Stimme) mit Untertiteln. Fallback: nur Text, wenn keine Stimme verfügbar ist. Lautstärke/Aus in den Einstellungen.
- **Rechtliche Abgrenzung (verbindlich):**
  - Das Konzept darf sich intern (Design-Dokument) an *Squirrel with a Gun* orientieren; es besteht aber keine Verbindung zum Original. Name, Marke, Logos, Figuren, Level, Dialoge, Musik, Sounds und Grafiken werden nicht verwendet oder nachgebaut.
  - Alles Eigenständige: eigene Welt, Figuren, Story, Namen, Missionen und Humor.
  - Keine Nennung des Originals in Spiel, Store-Texten, Marketing oder Spielname; keine Formulierungen, die eine Partnerschaft oder Ähnlichkeit suggerieren (z. B. "wie ..."), nur ggf. neutrale Genre-Begriffe.
  - Nur Assets mit klarer Lizenz (CC0/CC-BY o. ä.); Quellen und Lizenzen in `CREDITS.md`, Namensnennung im Spiel (Credits-Screen).
  - Eigene Texte/Stimmen; keine Imitation realer Personen, Marken oder Produkte (fiktive Marken im Spiel).
  - Vor Veröffentlichung: Namensrecherche (Markenregister DPMA/EUIPO) für "Cat Scratch" und Lizenz-Audit aller Abhängigkeiten und Assets.

## 11. Offene Punkte (noch zu klären)
- Design und Persönlichkeit von Timmi Tatz (Name ist festgelegt).
- Monetarisierung (kostenlos/Open Source laut Repo-Lizenz?).
