#!/usr/bin/env node
// Builds dist/index.html (nl), dist/en/index.html, dist/fr/index.html (once added), etc.
// from template.html + strings/<lang>.json. No dependencies, plain Node.
//
// Run: node build.js

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const INSTRUCTORS_DIR = path.join(ROOT, "instructors");
const PHOTO_RE = /^photo\.(jpe?g|png|webp|avif)$/i;
const SITE_URL = "https://thermoclinics.nl";

// To add a language: add an entry here and create strings/<code>.json
// (copy an existing one and translate the values).
const LANGS = [
  { code: "nl", dir: "", label: "Nederlands", default: true },
  { code: "en", dir: "en", label: "English" },
  { code: "fr", dir: "fr", label: "Français" },
];

const FLAG_SVG = {
  nl: `<svg viewBox="0 0 9 6" role="img" aria-hidden="true"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#fff"/><rect width="9" height="2" fill="#AE1C28"/></svg>`,
  en: `<svg viewBox="0 0 60 30" role="img" aria-hidden="true"><clipPath id="ukS"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="ukT"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#ukS)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#ukT)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`,
  fr: `<svg viewBox="0 0 9 6" role="img" aria-hidden="true"><rect width="3" height="6" fill="#0055A4"/><rect width="3" height="6" x="3" fill="#fff"/><rect width="3" height="6" x="6" fill="#EF4135"/></svg>`,
};

function pageUrl(lang) {
  return lang.dir ? `${SITE_URL}/${lang.dir}/` : `${SITE_URL}/`;
}

function buildHreflangLinks() {
  const lines = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l)}">`
  );
  const def = LANGS.find((l) => l.default) || LANGS[0];
  lines.push(`<link rel="alternate" hreflang="x-default" href="${pageUrl(def)}">`);
  return lines.join("\n");
}

function buildLangSwitcher(currentCode) {
  const current = LANGS.find((l) => l.code === currentCode);
  if (!current) return "";
  const currentFlag = FLAG_SVG[currentCode] || "";
  const options = LANGS.map((l) => {
    const flag = FLAG_SVG[l.code] || "";
    if (l.code === currentCode) {
      return `      <span class="lang-item current" aria-current="true" aria-label="${l.label}" title="${l.label}">${flag}</span>`;
    }
    return `      <a href="${l.dir ? "/" + l.dir + "/" : "/"}" hreflang="${l.code}" role="menuitem" aria-label="${l.label}" title="${l.label}" class="lang-item">${flag}</a>`;
  }).join("\n");
  return `<span class="lang" role="menu" aria-label="Language selector">
      <button type="button" class="lang-toggle" aria-haspopup="true" aria-expanded="false" aria-label="${current.label}">
        ${currentFlag}
      </button>
      <span class="lang-menu" role="menu">\n${options}\n      </span>
    </span>`;
}

// ---------- Instructors ----------
// One folder per instructor in instructors/, e.g. instructors/01-sanne/ with
// info.txt and photo.jpg. Folders are shown in name order; a folder whose name
// starts with "_" (or ".") is skipped, so it can be hidden without deleting it.
// See instructors/LEES-MIJ.md for the format of info.txt.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// info.txt: one "key: value" per line. Keys: name, role.<lang>, intro.<lang>
// ("role" and "intro" without a language are accepted too). Empty lines and
// lines starting with # are ignored. A line without a "key:" is added to the
// previous field, so a long intro may be wrapped over several lines.
function parseInfo(text) {
  const info = {};
  let lastKey = null;
  for (const raw of text.replace(/^﻿/, "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([A-Za-z]+(?:\.[A-Za-z]{2})?)\s*:\s*(.*)$/);
    if (m) {
      lastKey = m[1].toLowerCase();
      info[lastKey] = m[2].trim();
    } else if (lastKey) {
      info[lastKey] = (info[lastKey] + " " + line).trim();
    }
  }
  return info;
}

function loadInstructors() {
  if (!fs.existsSync(INSTRUCTORS_DIR)) return [];
  const folders = fs
    .readdirSync(INSTRUCTORS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !/^[_.]/.test(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "nl", { numeric: true }));

  const list = [];
  for (const folder of folders) {
    const dir = path.join(INSTRUCTORS_DIR, folder);
    const infoPath = path.join(dir, "info.txt");
    if (!fs.existsSync(infoPath)) {
      console.warn(`  ! instructors/${folder}: no info.txt found, skipped.`);
      continue;
    }
    let info;
    try {
      info = parseInfo(fs.readFileSync(infoPath, "utf8"));
    } catch (err) {
      console.warn(`  ! instructors/${folder}: could not read info.txt (${err.message}), skipped.`);
      continue;
    }
    if (!info.name) {
      console.warn(`  ! instructors/${folder}: info.txt has no "name:" line, skipped.`);
      continue;
    }
    const photoFile = fs.readdirSync(dir).find((f) => PHOTO_RE.test(f));
    let photo = null;
    if (photoFile) {
      const bytes = fs.readFileSync(path.join(dir, photoFile));
      const hash = crypto.createHash("md5").update(bytes).digest("hex").slice(0, 8);
      photo = { src: path.join(dir, photoFile), url: `/instructors/${folder}/${photoFile}?v=${hash}` };
    } else {
      console.warn(`  ! instructors/${folder}: no photo.jpg found, showing a placeholder.`);
    }
    list.push({ folder, info, photo });
  }
  return list;
}

// Text for one language, falling back to Dutch, then to a field without language.
function pick(info, field, langCode) {
  return info[`${field}.${langCode}`] || info[`${field}.nl`] || info[field] || "";
}

const PLACEHOLDER_SVG = `<svg viewBox="0 0 100 92" aria-hidden="true"><circle cx="50" cy="36" r="17"/><path d="M17 92c0-20 15-32 33-32s33 12 33 32z"/></svg>`;

function buildInstructorCards(instructors, langCode) {
  const cards = instructors.map(({ info, photo }) => {
    const name = escapeHtml(info.name);
    const role = pick(info, "role", langCode);
    const intro = pick(info, "intro", langCode); // may contain a simple <a> link, like the strings files
    const img = photo
      ? `<img src="${photo.url}" alt="${name}" loading="lazy" width="600" height="600">`
      : PLACEHOLDER_SVG;
    return `      <article class="team-card">
        <div class="team-photo${photo ? "" : " team-photo-empty"}">${img}</div>
        <div class="team-meta">
          ${role ? `<span class="team-role">${escapeHtml(role)}</span>` : ""}
          <h3>${name}</h3>
        </div>
        ${intro ? `<p class="team-intro">${intro}</p>` : ""}
      </article>`;
  });
  return cards.join("\n");
}

function main() {
  const template = fs.readFileSync(path.join(ROOT, "template.html"), "utf8");
  const instructors = loadInstructors();
  console.log(`Instructors: ${instructors.length} (${instructors.map((i) => i.folder).join(", ") || "none"})`);

  for (const lang of LANGS) {
    const stringsPath = path.join(ROOT, "strings", `${lang.code}.json`);
    if (!fs.existsSync(stringsPath)) {
      console.warn(`Skipping "${lang.code}": no strings/${lang.code}.json found.`);
      continue;
    }
    const strings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));

    let html = template;

    // No instructors yet: leave out the section and its menu item entirely.
    if (instructors.length === 0) {
      html = html.replace(/[ \t]*<!--team-->[\s\S]*?<!--\/team-->\n?/g, "");
    }

    // Built-in/dynamic placeholders (not in the JSON files)
    const dynamic = {
      html_lang: lang.code,
      hreflang_links: buildHreflangLinks(),
      lang_switcher: buildLangSwitcher(lang.code),
      team_cards: buildInstructorCards(instructors, lang.code),
      team_count: String(instructors.length),
    };
    const all = { ...strings, ...dynamic };

    html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (key in all) return all[key];
      console.warn(`  ! Missing key "${key}" for language "${lang.code}" — left as-is.`);
      return match;
    });

    const outDir = path.join(ROOT, "dist", lang.dir);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, html, "utf8");
    console.log(`Built ${path.relative(ROOT, outFile)}`);
  }

  // Copy static assets straight into dist/ so dist/ is a complete, deployable site.
  copyDir(path.join(ROOT, "shared"), path.join(ROOT, "dist", "shared"));
  copyDir(path.join(ROOT, "images"), path.join(ROOT, "dist", "images"));

  // Copy only the photos of the instructors that are shown.
  for (const { folder, photo } of instructors) {
    if (!photo) continue;
    const destDir = path.join(ROOT, "dist", "instructors", folder);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(photo.src, path.join(destDir, path.basename(photo.src)));
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

main();
