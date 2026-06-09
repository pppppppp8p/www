# PPPPPPPP — Changelog

## 2026-06-09 — v0.2 — Redesign hero + sekcje 4 i 5

### Zmieniono
- **HERO** — całkowity redesign na układ editorial typography:
  - Nagłówek podzielony na 4 linie z różnymi rozmiarami i wyrównaniem (lewa/prawa/środek)
  - "MARKOM" jest outlined (text-stroke), reszta filled — kontrast jak w inspiracjach ALPHA/LUMINESCENT
  - Każde słowo porusza się w innym tempie przy scrollowaniu (parallax)
  - Pixel spray canvas — losowo rozmieszczone piksele pomarańcz/fiolet w całym tle hero
  - Usunięty pomarańczowy pasek boczny (kolidował z nav)
  - Nav nie najeżdża na żaden element — prawidłowe z-index
- **BAND** — scrollujący pomarańczowy pasek separator między sekcjami
- **Sekcja 02** — quote section węższa (max-width: 640px), nie full-width
- **Sekcja 03** — naprawiona orientacja pixel spray w narożnikach kart
- **Przyciski** — border-radius: 16px (zaokrąglone jak w brandingu)
- **Karty** — border-radius: 16px, pixel spray density w narożniku TOP-RIGHT poprawnie

### Dodano
- **Sekcja 04 — MANIFEST** — dwie kolumny: duży lead po lewej, treść po prawej, quote card pomarańczowa
- **Sekcja 05 — TRANSFORMACJE** — accordion z animacją, 4 punkty wejścia
- **BAND violet** — fioletowy pasek separator przed sekcją 4
- Scroll reveal animations: reveal, reveal-left, reveal-right, reveal-stagger

## 2026-06-09 — v0.1 — Pierwsze sekcje

### Dodano
- index.html, css/style.css, js/main.js
- Sekcje: Hero, Statement, Szybka orientacja
- Fonty lokalne: Oddval Bold/Black, Satoshi Medium/Regular
- assets/ folder z asety graficznymi
