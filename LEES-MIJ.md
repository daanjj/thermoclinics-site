# ThermoClinics website

Twee taalversies (Nederlands en Engels) die hun opmaak, code en tekst-structuur delen.
Geen WordPress, geen database. De zichtbare tekst staat in losse, eenvoudige tekstbestanden
die je zelf kunt aanpassen; de pagina wordt daaruit automatisch opgebouwd.

```
template.html     ← de opbouw van de pagina (vakjes, koppen, secties) — hier hoef je nooit in te kijken
strings/
  nl.json          ← alle Nederlandse tekst
  en.json          ← alle Engelse tekst
  fr.json          ← (zodra Frans erbij komt)
build.js           ← bouwt de website uit template.html + de json-bestanden, automatisch
shared/
  style.css        ← alle opmaak (CSS), voor alle talen
  app.js           ← alle code (agenda + testimonials), voor alle talen
images/            ← logo's en foto's
dist/              ← het eindresultaat (wordt automatisch gegenereerd, hier niets aanpassen)
```

## Tekst aanpassen

Open `strings/nl.json` (Nederlands) of `strings/en.json` (Engels) in de GitHub-website-editor
(potloodje bij het bestand → bewerken). Je ziet regels zoals:

```json
"hero_title": "Weet hoe warm je écht loopt",
```

Pas alleen de tekst tussen de aanhalingstekens aan, na de `:`. Laat de naam vóór de `:`
(bijv. `hero_title`) en de aanhalingstekens zelf staan. Sla op (commit) en de site wordt
binnen ongeveer een minuut automatisch opnieuw gebouwd en gepubliceerd.

Een paar regels bevatten een klein stukje link, zoals:

```json
"footer_link_foundation": "<a href=\"https://www.hittebewustsporten.nl\">Stichting Hittebewust Sporten</a>",
```

Verander dan alleen de tekst tussen `>` en `</a>` (hier: "Stichting Hittebewust Sporten").
De rest van die regel (de link zelf) hoef je niet aan te raken.

Een tekst die in beide talen moet veranderen, pas je in zowel `nl.json` als `en.json` aan
(bij dezelfde naam, bijv. `hero_title` in allebei).

**Wat je NIET hoeft aan te raken:** `template.html`, `build.js`, en de map `dist/`. Die
zorgen automatisch voor de opmaak en de gepubliceerde pagina's; daar zit geen tekst in om
aan te passen.

## Een foto vervangen

Zet een nieuwe afbeelding in de map `images/` met exact dezelfde bestandsnaam:
- `clinic-duurloop.jpg`  (eerste foto bij "De clinic")
- `clinic-analyse.jpg`   (tweede foto bij "De clinic")

Liggend formaat (16:9) werkt het mooist. Je hoeft niets anders aan te passen.

## Logo

`images/logo.avif` (header) en `images/logo-white.png` (footer, witte versie).
Vervang met dezelfde naam als je het logo ooit wijzigt.

## Opmaak of code wijzigen (geldt voor alle talen tegelijk)

Kleuren, lettertypes en layout staan in `shared/style.css`. De agenda- en
testimonial-code staat in `shared/app.js`. Dit is voor een ontwikkelaar, niet voor
dagelijks tekstonderhoud.

## Wat je NIET in de tekstbestanden hoeft te wijzigen

- Clinicdata: komen uit Google Calendar.
- Inschrijvingen: via het Google Form.
- Testimonials: uit het goedgekeurde tabblad in de Sheet.

## Koppelingen (bovenin `shared/app.js`)
- `CLINICS_TSV_URL`        -> gepubliceerde TSV met geplande clinics
- `FORM_URL`               -> link naar het inschrijf-Form
- `FORM_PREFILL_BASE` + `FORM_ENTRY` -> link die de gekozen clinic voorselecteert
- `TESTIMONIALS_TSV_URL`   -> gepubliceerde TSV van het tabblad "Goedgekeurd"

## Frans toevoegen (later)

Een ontwikkelaar maakt dan `strings/fr.json` (een kopie van `nl.json` met vertaalde
tekst) en voegt één regel toe in `build.js`. Daarna kun je als beheerder net zo in
`fr.json` werken als nu in `nl.json` en `en.json`.

## Hoe het online komt

De site staat op GitHub en wordt automatisch gepubliceerd via Cloudflare Pages: elke
keer dat een tekstbestand wordt opgeslagen (commit), bouwt en publiceert het systeem de
site opnieuw binnen ongeveer een minuut. Niemand hoeft handmatig iets te uploaden.
