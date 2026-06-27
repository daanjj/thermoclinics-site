#!/usr/bin/env node
// Builds dist/index.html (nl), dist/en/index.html, dist/fr/index.html (once added), etc.
// from template.html + strings/<lang>.json. No dependencies, plain Node.
//
// Run: node build.js

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
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
  const others = LANGS.filter((l) => l.code !== currentCode);
  const currentFlag = FLAG_SVG[currentCode] || "";
  const currentItem = `      <span class="current" aria-current="page" aria-label="${current.label}" title="${current.label}">
        ${currentFlag}
      </span>`;
  const links = others
    .map((l) => {
      const flag = FLAG_SVG[l.code] || "";
      return `      <a href="${l.dir ? "/" + l.dir + "/" : "/"}" hreflang="${l.code}" aria-label="${l.label}" title="${l.label}">
        ${flag}
      </a>`;
    })
    .join("\n");
  return `<span class="lang">\n${currentItem}\n${links}\n    </span>`;
}

function main() {
  const template = fs.readFileSync(path.join(ROOT, "template.html"), "utf8");

  for (const lang of LANGS) {
    const stringsPath = path.join(ROOT, "strings", `${lang.code}.json`);
    if (!fs.existsSync(stringsPath)) {
      console.warn(`Skipping "${lang.code}": no strings/${lang.code}.json found.`);
      continue;
    }
    const strings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));

    let html = template;

    // Built-in/dynamic placeholders (not in the JSON files)
    const dynamic = {
      html_lang: lang.code,
      hreflang_links: buildHreflangLinks(),
      lang_switcher: buildLangSwitcher(lang.code),
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
