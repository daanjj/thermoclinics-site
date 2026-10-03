# Instructeurs op de website

Elke instructeur heeft een eigen map in deze map `instructors/`. De website bouwt de
sectie "Door wie" automatisch uit deze mappen. Je hoeft geen code aan te passen.

```
instructors/
  01-sanne/
    photo.jpg      ← de foto
    info.txt       ← naam, rol en introductie
  02-pieter/
    photo.jpg
    info.txt
  _voorbeeld/      ← begint met _ en wordt dus niet getoond (sjabloon om te kopiëren)
```

## Een instructeur toevoegen

1. Maak een nieuwe map, bijvoorbeeld `03-anna`. Het nummer bepaalt de volgorde op de
   website (01 eerst, dan 02, enzovoort). Gebruik in de mapnaam alleen kleine letters,
   cijfers en streepjes, geen spaties.
2. Zet er een foto in met de naam `photo.jpg` (ook `.png` of `.webp` mag).
3. Kopieer `info.txt` uit de map `_voorbeeld` naar de nieuwe map en vul hem in.
4. Opslaan (commit). Binnen ongeveer een minuut staat de instructeur op de site.

Via de GitHub-website: open de map `instructors`, kies **Add file → Upload files** en
sleep de hele map (met foto en `info.txt`) in het venster. Daarna **Commit changes**.

## Een instructeur verwijderen of tijdelijk verbergen

- **Verbergen:** zet een `_` voor de mapnaam (`03-anna` wordt `_03-anna`). De gegevens
  blijven bewaard; haal de `_` weg om de instructeur weer te tonen.
- **Verwijderen:** verwijder de map (de foto en `info.txt`).

Zijn er helemaal geen zichtbare instructeurs, dan verdwijnen de sectie en het
menu-item "Door wie" vanzelf van de website.

## Het bestand info.txt

Eén gegeven per regel, in de vorm `naam-van-het-veld: tekst`:

```
name: Sanne Jansen
role.nl: Inspanningsfysioloog
role.en: Exercise physiologist
role.fr: Physiologiste de l’effort
intro.nl: Sanne begeleidt al tien jaar ...
intro.en: Sanne has been coaching runners for ten years ...
intro.fr: Sanne accompagne des coureurs depuis dix ans ...
```

- `name` is verplicht. Zonder naam wordt de instructeur overgeslagen.
- `role` (de korte regel boven de naam) is optioneel.
- `.nl`, `.en` en `.fr` geven de taal aan. Ontbreekt een Engelse of Franse tekst, dan
  toont de site daar de Nederlandse.
- Een lange introductie mag over meerdere regels lopen: een regel zonder `veld:` ervoor
  hoort bij de regel erboven.
- Houd de introductie kort: twee à drie zinnen (40 tot 60 woorden) leest het best.
- Je mag gewone aanhalingstekens gebruiken; hier kan dat, anders dan in de json-bestanden.

Gaat er iets mis met één instructeur (bijvoorbeeld geen `name:`), dan wordt alleen die
instructeur overgeslagen; de rest van de website wordt gewoon gepubliceerd.

## De foto

- Vierkant werkt het best, minimaal 600 × 600 pixels.
- Houd het bestand klein: liefst onder 300 KB (jpg).
- Een niet-vierkante foto wordt automatisch vierkant bijgesneden (vanuit het midden).
- Zorg dat de foto's van alle instructeurs op elkaar lijken: zelfde uitsnede (hoofd en
  schouders), vergelijkbare achtergrond en belichting. Dat maakt het geheel rustig.
- Ontbreekt de foto, dan toont de site een neutraal silhouet.

## De koppen boven de sectie

De titel ("De mensen achter ThermoClinics"), het kopje erboven, de introzin en het
menu-item "Door wie" staan in `strings/nl.json`, `strings/en.json` en `strings/fr.json`
onder `team_eyebrow`, `team_title`, `team_intro` en `nav_doorwie`.
