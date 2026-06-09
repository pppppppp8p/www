# PPPPPPPP — Changelog

## 2026-06-09 — v0.4 — Hero physics letters

### Zmieniono
- **HERO — nagłówek** — zastąpiono statyczny `.hero-type` przez 8 interaktywnych liter "P" (`.hero-letters` / `.hero-p`)
  - Litery stoją nieruchomo nad głową Przema do czasu pierwszej interakcji
  - Kursor w promieniu 140px odpycha literę (jak magnes) — aktywuje fizykę grawitacji
  - Każda litera spada, odbija się od dołu hero (FLOOR_PAD=120px) i zostaje gdzie upadła
  - Mobile: pierwsze `touchstart` rozrzuca wszystkie litery jednocześnie losowym impulsem
  - Brak respawnu — interakcja jest nieodwracalna
- **Kolorystyka liter** — 5× biały fill, 2× outlined (text-stroke biały), 1× orange, 1× violet
- **CSS** — usunięto stare style `.hero-type`, `.hero-word`, `.hw-*`
- **JS** — usunięto dead code `heroWords` + `speeds`; dodano samodzielne IIFE z fizyką (RAF loop, bez globalnego stanu)

## 2026-06-09 — v0.3 — Feedback round 2

### Usunięto
- **Sekcja 02 (Statement)** — kompletnie wypierdolona z HTML i CSS
- Stary scroll handler bandy (był zepsuty)

### Zmieniono
- **HERO — foto** — z prawej strony → lewa, duże (do 58vw), editorial magazine layout; tekst right-aligned; gradient fade na dole zapewnia czytelność CTA
- **BAND (orange)** — usunięto auto-animation; tekst porusza się TYLKO przy scrollowaniu (scroll-driven via JS modulo loop); nowy tekst: brand experience · total experience · experience design · customer experience · service design · system thinking · marketing i strategy; font mniejszy (clamp 10–14px)
- **BAND (violet)** — również scroll-driven (idx=1 → odwrotny kierunek)
- **Kursor** — instant follow (bezpośrednio z mousemove, bez lagującego lerp 0.18); po najechaniu na `a`/`button` zmienia się na większy krzyż biały, system hand cursor nigdy nie pojawia
- **Karty (Sekcja 03)** — organiczne SVG blob shapes zamiast border-radius:
  - Card 1: ukośne ucięcie top-left + wypustka po prawej (środek)
  - Card 2: dwie wypustki po prawej stronie
  - Card 3: ukośne ucięcie top-right + wypustka po prawej (niżej)
  - Hover: `translateY(-12px)` + `filter: drop-shadow` w kolorze orange (card unosi się)
- **Accordion hover** — dodany hover state na trigger

### Dodano
- `cursor: none` na wszystkich `a` i `button` (brak systemowej rączki)
- Focus-visible outline dla dostępności klawiaturowej

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
