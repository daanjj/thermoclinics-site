/* ============================================================
   Taalafhankelijke teksten (i18n)
   De pagina kiest de set op basis van <html lang="..">.
   nl = standaard/fallback, en = Engels.
   ============================================================ */
const i18n = {
  nl: {
    noClinics: 'Er staan nu geen open clinics gepland. Mail <a href="mailto:info@thermoclinics.nl">info@thermoclinics.nl</a> om er een te organiseren voor jouw groep of vereniging.',
    calendarError: 'De agenda kan nu niet geladen worden. Mail <a href="mailto:info@thermoclinics.nl">info@thermoclinics.nl</a> voor de eerstvolgende data.',
    locale: 'nl-NL',
    seats: n => n + ' plek' + (n === 1 ? '' : 'ken') + ' vrij',
    full: 'Vol',
    signUp: 'Schrijf je in &rarr;',
    testimonialBy: 'Deelnemer ThermoClinic',
    prevQuote: 'Vorige quote',
    nextQuote: 'Volgende quote'
  },
  en: {
    noClinics: 'There are no open clinics scheduled right now. Email <a href="mailto:info@thermoclinics.nl">info@thermoclinics.nl</a> to arrange one for your group or club.',
    calendarError: 'The calendar can\'t be loaded right now. Email <a href="mailto:info@thermoclinics.nl">info@thermoclinics.nl</a> for the next available dates.',
    locale: 'en-GB',
    seats: n => n + ' spot' + (n === 1 ? '' : 's') + ' left',
    full: 'Full',
    signUp: 'Sign up &rarr;',
    testimonialBy: 'ThermoClinic participant',
    prevQuote: 'Previous quote',
    nextQuote: 'Next quote'
  }
};
const t = i18n[document.documentElement.lang] ?? i18n.nl;

/* ============================================================
   Geplande open clinics uit een gepubliceerd Google Sheet tabblad
   Werkwijze:
   1. In de Sheet staat een tabblad (bijv. "Website") dat met een
      ARRAYFORMULA alleen de open clinics met vrije plekken klaarzet,
      met vijf kolommen: A = datum (yyyy-mm-dd), B = tijdstip,
      C = locatie, D = aantal vrije plekken, E = formulier-keuzetekst
      (de exacte optietekst die het Apps Script in het formulier zet).
      Rij 1 is de kop.
   2. Bestand > Delen > Publiceren op het web > alleen dat tabblad,
      als TSV (tab-gescheiden, output=tsv). Plak de URL hieronder.
   3. FORM_URL: korte link naar het formulier (fallback, zonder voorselectie).
   4. FORM_PREFILL_BASE + FORM_ENTRY: voor een link die de clinic alvast
      selecteert. De keuzetekst (kolom E) moet teken-voor-teken gelijk zijn
      aan een optie in het formulier, anders negeert Google Forms hem.
   Niet bereikbaar of leeg: de fallback-tekst hieronder verschijnt.
   ============================================================ */
const CLINICS_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4XnOhuKEIlaM5HtB3T5spvoTi1tJpi3o6yfNzUqkFkgn3Dkz4UZAQBvN9cB5nvP9BTJdlOQOj80OO/pub?gid=1311672863&single=true&output=tsv';
const FORM_URL = 'https://forms.gle/ppYkgLkQPBkrKdsA8';
const FORM_PREFILL_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSfuY652ieg5tA1C4OaZ0yH-ABqAXh7Yl4y_eEwNutwrAAcLRQ/viewform?usp=pp_url';
const FORM_ENTRY = 'entry.1849163621';
const MAX_EVENTS = 6;

async function loadClinics(){
  const box = document.getElementById('events');
  const fallback = document.getElementById('agenda-fallback');
  try{
    const res = await fetch(CLINICS_TSV_URL);
    if(!res.ok) throw new Error(res.status);
    const rows = parseTSV(await res.text()).slice(1)        // kop overslaan
      .filter(r => r[0] && r[0].trim())                     // lege regels weg
      .slice(0, MAX_EVENTS);
    if(rows.length === 0){
      fallback.innerHTML = t.noClinics;
      return;
    }
    const fmtDate = new Intl.DateTimeFormat(t.locale,{weekday:'short',day:'numeric',month:'long'});
    box.innerHTML = rows.map(r => {
      const date  = (r[0]||'').trim();
      const time  = (r[1]||'').trim();
      const loc   = (r[2]||'').trim();
      const n     = parseInt(r[3], 10);
      const label = (r[4]||'').trim();   // exacte keuzetekst voor het formulier
      const hasSeats = !isNaN(n) && n > 0;
      const when = fmtDate.format(new Date(date + 'T12:00:00')) + (time ? ' &middot; ' + esc(time) : '');
      const seats = isNaN(n) ? '' : (hasSeats ? t.seats(n) : t.full);
      const seatLine = seats ? '<div class="eloc">' + seats + '</div>' : '';
      // Prefill alleen bij een open clinic met vrije plekken; anders de gewone link.
      const link = (label && hasSeats)
        ? FORM_PREFILL_BASE + '&' + FORM_ENTRY + '=' + encodeURIComponent(label)
        : FORM_URL;
      return '<div class="event">'
        + '<div class="edate">' + when + '</div>'
        + '<div class="etitle">' + (loc ? esc(loc) : 'ThermoClinic') + '</div>'
        + seatLine
        + '<div class="ebtn"><a href="' + esc(link) + '" target="_blank" rel="noopener">' + t.signUp + '</a></div>'
        + '</div>';
    }).join('');
  }catch(err){
    fallback.innerHTML = t.calendarError;
  }
}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
loadClinics();

/* ============================================================
   Testimonials uit een gepubliceerd Google Sheet tabblad
   Werkwijze:
   1. Inzendingen komen via een Google Form binnen in een Sheet.
   2. Maak in die Sheet een tabblad "Goedgekeurd" met twee kolommen:
      A = quote (zonder aanhalingstekens), B = naamsvermelding
      (bijv. "Marieke, AV Pijnenburg"). Rij 1 is de kop.
   3. Kopieer goedgekeurde inzendingen handmatig naar dit tabblad.
   4. Bestand > Delen > Publiceren op het web > alleen dit tabblad,
      als TSV (tab-gescheiden, output=tsv). Plak de URL hieronder.
   Niet geconfigureerd of mislukt: de vaste quote hierboven blijft staan.
   ============================================================ */
const TESTIMONIALS_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBlZX9fNIaMtfLhI6Q2UsZ_7vDz-MUmFXZ5qPGwusCiJ05c2P_dxaYcz9c4uH05bQ--52pFFYO2uuE/pub?gid=1519514211&single=true&output=tsv';  // bijv. https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=tsv

async function loadTestimonial(){
  if(!TESTIMONIALS_TSV_URL) return;
  try{
    const res = await fetch(TESTIMONIALS_TSV_URL);
    if(!res.ok) throw new Error(res.status);
    const rows = parseTSV(await res.text()).slice(1)
      .filter(r => r[0] && r[0].trim())
      .map(r => [r[0].replace(/\r\n?/g, '\n').trim(), (r[1] || t.testimonialBy).trim()]);
    if(rows.length === 0) return;

    // Schud de volgorde, zodat bezoekers niet altijd dezelfde reeks zien.
    for(let i = rows.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [rows[i], rows[j]] = [rows[j], rows[i]];
    }

    const block = document.getElementById('quote-block');
    const textEl = document.getElementById('quote-text');
    const citeEl = document.getElementById('quote-cite');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, counter = null;

    function render(){
      // \n wordt expliciet een <br>; lege regels (\n\n) blijven zo zichtbaar.
      textEl.innerHTML = '“' + esc(rows[i][0]).replace(/\n/g, '<br>') + '”';
      citeEl.textContent = rows[i][1];
      if(counter) counter.textContent = (i + 1) + ' / ' + rows.length;
    }

    function go(dir){
      i = (i + dir + rows.length) % rows.length;
      if(reduce){ render(); return; }
      block.style.opacity = '0';                       // uitfaden
      setTimeout(() => { block.style.opacity = '1'; render(); }, 250);
    }

    // Navigatieknoppen alleen tonen bij meerdere quotes.
    if(rows.length > 1){
      const nav = document.createElement('div');
      nav.className = 'quote-nav';
      const prev = document.createElement('button');
      prev.type = 'button'; prev.className = 'quote-arrow';
      prev.setAttribute('aria-label', t.prevQuote); prev.innerHTML = '&larr;';
      const next = document.createElement('button');
      next.type = 'button'; next.className = 'quote-arrow';
      next.setAttribute('aria-label', t.nextQuote); next.innerHTML = '&rarr;';
      counter = document.createElement('span');
      counter.className = 'quote-counter';
      prev.addEventListener('click', () => go(-1));
      next.addEventListener('click', () => go(1));
      nav.append(prev, counter, next);
      block.insertAdjacentElement('afterend', nav);
    }

    render();                       // eerste quote tonen
  }catch(err){ /* vaste quote blijft staan */ }
}

function parseTSV(text){
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i];
    if(inQuotes){
      if(c === '"'){
        if(text[i+1] === '"'){ field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if(c === '"') inQuotes = true;
    else if(c === '\t'){ row.push(field); field = ''; }
    else if(c === '\n' || c === '\r'){
      if(c === '\r' && text[i+1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if(field || row.length){ row.push(field); rows.push(row); }
  return rows;
}
loadTestimonial();
initLangMenu();

function initLangMenu(){
  const toggle = document.querySelector('.lang-toggle');
  if(!toggle) return;
  const container = toggle.closest('.lang');
  const menu = container.querySelector('.lang-menu');
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = container.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  document.addEventListener('click', (event) => {
    if(!container.contains(event.target)){
      container.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape' && container.classList.contains('open')){
      container.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      container.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   Umami: sectie-zichtbaarheid + scroll-diepte
   Stuurt custom events naar Umami zodat in het dashboard te zien is
   hoe ver bezoekers de pagina doorlopen (per sectie, en bij 50%/100%
   scroll als extra vangnet). Eén event per sectie/mijlpaal per bezoek.
   Het Umami-script staat met "defer" in <head>, dit bestand niet, dus
   window.umami kan nog niet bestaan op het moment dat dit script
   draait — daarom altijd via track() met een beschikbaarheidscheck.
   ============================================================ */
function track(name, data){
  if(window.umami && typeof window.umami.track === 'function') window.umami.track(name, data);
}

function initSectionTracking(){
  const sections = document.querySelectorAll('main section[id]');
  if(!sections.length || !('IntersectionObserver' in window)) return;
  const seen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting && !seen.has(entry.target.id)){
        seen.add(entry.target.id);
        track('section_view', { section: entry.target.id });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => observer.observe(s));
}

function initScrollDepthTracking(){
  const milestones = [50, 75, 100];
  const fired = new Set();
  function check(){
    const doc = document.documentElement;
    const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
    milestones.forEach((m) => {
      if(scrolled >= m && !fired.has(m)){
        fired.add(m);
        track('scroll_depth', { percent: m });
      }
    });
    if(fired.size === milestones.length) window.removeEventListener('scroll', check);
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
}

initSectionTracking();
initScrollDepthTracking();
