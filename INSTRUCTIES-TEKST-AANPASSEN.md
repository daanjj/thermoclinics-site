# Tekst aanpassen op de ThermoClinics website

Deze handleiding laat zien hoe je teksten op de website wijzigt. Je hebt geen technische
kennis nodig: je past alleen woorden aan tussen aanhalingstekens in een tekstbestand.
Zodra je een wijziging opslaat, wordt de website binnen ongeveer een minuut automatisch
bijgewerkt.

## Stap 0: een GitHub-account (eenmalig, alleen als je er nog geen hebt)

De website staat op GitHub, een gratis platform waar de broncode en teksten van de site
bewaard worden.

1. Ga naar [github.com](https://github.com/) en klik rechtsboven op **Sign up**.
2. Vul een e-mailadres in (bijvoorbeeld je ThermoClinics- of Stichting-mailadres),
   verzin een wachtwoord en een gebruikersnaam.
3. Bevestig je e-mailadres via de link die GitHub je stuurt.
4. Laat mij (Daan) weten welke gebruikersnaam of welk e-mailadres je hebt gebruikt, dan
   geef ik je toegang tot het project. Zonder die toegang kun je de website wel bekijken,
   maar geen teksten wijzigen.

Heb je al een GitHub-account? Dan kun je deze stap overslaan.

## Stap 1: naar de juiste bestanden

1. Log in op [github.com](https://github.com/).
2. Ga naar de projectpagina: **github.com/daanjj/thermoclinics-site**
3. Klik op de map **strings**.
4. Je ziet twee bestanden:
   - `nl.json` — alle Nederlandse tekst
   - `en.json` — alle Engelse tekst
5. Klik op het bestand dat je wilt aanpassen.

## Stap 2: een tekst wijzigen

1. Rechtsboven in het bestand zie je een potlood-icoontje (bewerken). Klik daarop.
2. Je ziet nu regels die er ongeveer zo uitzien:

   ```json
   "hero_title": "Weet hoe warm je écht loopt",
   ```

   Het stuk vóór de `:` (hier `hero_title`) is een naam die het systeem gebruikt om te
   weten waar de tekst op de pagina moet komen. **Die naam laat je altijd staan.**
   Je past alleen de tekst aan tussen de aanhalingstekens ná de `:`.

3. Wil je bijvoorbeeld de hoofdtekst veranderen? Zoek de regel met de naam die bij dat
   onderdeel past (de namen zijn redelijk herkenbaar, zoals `hero_title`, `signup_text`,
   `footer_tagline`), en typ de nieuwe tekst tussen de aanhalingstekens.

4. Let bij het wijzigen op een paar dingen:
   - Laat de aanhalingstekens (`"`) aan begin en eind van de tekst staan.
   - Laat de komma (`,`) aan het eind van de regel staan, behalve bij de allerlaatste
     regel van het bestand (die heeft geen komma — als die er al niet stond, hoef je
     niets te doen).
   - Gebruik geen rechte aanhalingstekens (`"`) *binnen* je eigen tekst. Wil je toch een
     aanhalingsteken in de tekst gebruiken, gebruik dan de "krullende" versie: ' of ' of
     " of ". Een recht aanhalingsteken middenin de tekst breekt het bestand.

5. Sommige regels bevatten een klein stukje link, zoals:

   ```json
   "footer_link_foundation": "<a href=\"https://www.hittebewustsporten.nl\">Stichting Hittebewust Sporten</a>",
   ```

   Verander hier alleen de tekst tussen `>` en `</a>` (in dit voorbeeld: "Stichting
   Hittebewust Sporten"). De rest van die regel (de link zelf, tussen de `<a href=...>`
   en `>`) laat je ongewijzigd staan.

6. Wil je een tekst aanpassen die in beide talen voorkomt? Pas dan dezelfde naam aan in
   zowel `nl.json` als `en.json`. Dat doe je in twee losse stappen (eerst het ene
   bestand opslaan, dan het andere openen).

## Stap 3: opslaan (committen)

1. Scroll naar onderaan de pagina. Daar staat een vakje "Commit changes" (wijzigingen
   vastleggen).
2. Je kunt een korte omschrijving van je wijziging invullen (bijvoorbeeld "tekst
   inschrijfknop aangepast"), maar dat is niet verplicht.
3. Klik op de groene knop **Commit changes**.
4. Klaar. Binnen ongeveer een minuut wordt de website automatisch opnieuw gebouwd en
   gepubliceerd met je nieuwe tekst.

## Even controleren

Open de website (thermoclinics.nl) na ongeveer een minuut in een nieuw tabblad en
controleer of je wijziging goed op de pagina staat. Zie je je wijziging niet, wacht dan
nog een minuutje en vernieuw de pagina (eventueel met Ctrl+F5 / Cmd+Shift+R om een oude,
opgeslagen versie te overslaan).

## Wat je NIET hoeft (en niet zou moeten) aanpassen

- `template.html`, `build.js`, `shared/style.css`, `shared/app.js`, de map `dist/` —
  dit is de techniek achter de site, hier zit geen leesbare tekst in.
- Foto's vervang je door een nieuw bestand in de map `images/` te uploaden met **exact**
  dezelfde bestandsnaam als het bestaande bestand. Tekst hoef je daarvoor niet aan te
  passen.
- Clinicdata, inschrijvingen en testimonials komen automatisch uit Google Calendar,
  het Google Form en de Google Sheet. Daar verander je niets in de tekstbestanden voor.

## Iets misgegaan? Een eerdere versie terugzetten

Heb je per ongeluk een aanhalingsteken of komma verwijderd, of staat er nu iets verkeerd
op de site? Geen paniek: GitHub onthoudt elke eerdere versie van het bestand. Je kunt dit
zelf herstellen, zonder dat er iets verloren gaat.

1. Open het bestand dat je had aangepast (`strings/nl.json` of `strings/en.json`) op
   GitHub, zoals in stap 1 hierboven.
2. Klik rechtsboven, naast het potlood-icoontje, op het klok-icoontje (**History** /
   geschiedenis). Dit toont een lijst van alle eerdere wijzigingen aan dit bestand, met
   datum en omschrijving.
3. Klik op de versie van vóór je foutje, meestal de regel net boven je eigen, recente
   wijziging.
4. Je ziet nu hoe het bestand er op dat moment uitzag. Klik rechtsboven op het
   kopieer-icoontje bij **Copy raw contents** (of selecteer en kopieer alle tekst in het
   bestand).
5. Ga terug naar het bestand via de map `strings` en klik weer op het potlood-icoontje
   om te bewerken.
6. Selecteer in het bewerkvenster alle huidige tekst (Ctrl+A op Windows, Cmd+A op Mac) en
   verwijder die.
7. Plak de tekst die je in stap 4 hebt gekopieerd terug in het lege bewerkvenster.
8. Scroll naar onderaan en klik op **Commit changes**, zoals in stap 3 hierboven.

Na ongeveer een minuut staat de oude, werkende tekst weer live op de site.

Komt je er niet uit, of weet je niet zeker welke versie de juiste is? Mail of bel Daan,
dan zoeken we samen de laatste werkende versie op en zetten die terug.
