# Setting up GitHub + Cloudflare Pages

The site now uses `template.html` + `strings/<lang>.json` + `build.js` (see `LEES-MIJ.md` for what the site owner edits). `build.js` is a small, dependency-free Node script that generates the actual deployable files into `dist/` — Cloudflare Pages builds that step automatically on every push.

## 1. Create the GitHub repo

1. Go to github.com, sign in (or create a free account), click **New repository**.
2. Name it e.g. `thermoclinics-site`. Keep it **Public** (required for Cloudflare Pages' free tier to deploy from it without extra setup; Private also works on Pages but public is simpler).
3. Don't initialize with a README (you already have `LEES-MIJ.md`).

Push the current folder to it:

```bash
cd "2026 ThermoClinics site"
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/thermoclinics-site.git
git push -u origin main
```

If you'd rather not use the command line, GitHub Desktop (free app) does the same thing by pointing it at the folder and clicking "Publish repository."

## 2. Connect Cloudflare Pages

1. Log in at dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Authorize GitHub, pick the `thermoclinics-site` repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: `node build.js`
   - Build output directory: `dist`
4. Click **Save and Deploy**. Cloudflare runs `build.js` (no dependencies to install, it's plain Node) and gives you a `thermoclinics-site.pages.dev` URL — check it loads correctly, including `/en/`.

From now on: every push to `main` triggers a Cloudflare build automatically. The non-tech owner only ever opens `strings/nl.json` or `strings/en.json` in the GitHub web editor (pencil icon → edit the text between the quotes → commit) and the live site rebuilds and updates within about a minute. No GitHub Actions workflow is needed — Cloudflare Pages runs the build command itself.

## 3. Point your domain at it, keeping DNS at Hostnet

This is the one part with a wrinkle: Cloudflare Pages' custom domain feature wants to manage DNS for the domain (free, just changes your nameservers to Cloudflare's), or you add records at your existing DNS host. Since you want to keep registration *and* DNS at Hostnet, here's what works:

**For `www.thermoclinics.nl`** (subdomain — easy):
- In Cloudflare Pages → your project → **Custom domains** → add `www.thermoclinics.nl`. Cloudflare shows you a target like `thermoclinics-site.pages.dev`.
- At Hostnet's DNS panel, add a **CNAME** record: `www` → `thermoclinics-site.pages.dev`.

**For the bare domain `thermoclinics.nl`** (apex — DNS doesn't allow CNAME at the root):
- Option A (simplest): use Hostnet's domain forwarding/redirect feature to 301-redirect `thermoclinics.nl` → `https://www.thermoclinics.nl`, and let `www` be the canonical address. Most registrars including Hostnet offer this as "domain forwarding" in the DNS panel.
- Option B: if Hostnet supports an **ALIAS** or **ANAME** record type (some do), point the apex at `thermoclinics-site.pages.dev` directly — no redirect needed.
- Option C: move just the DNS (not registration) to Cloudflare's free nameservers. Registration stays at Hostnet, but Cloudflare can then flatten the CNAME at the apex automatically. This is the most robust option if Hostnet doesn't support ALIAS/ANAME — worth checking their panel first since it avoids a nameserver change.

I'd check Hostnet's DNS panel for an ALIAS/ANAME option first; if it's not there, the forwarding redirect (Option A) is the least fuss and keeps everything at Hostnet as you wanted.

## 4. Adding French later

Copy `strings/nl.json` to `strings/fr.json` and translate the values, then uncomment the `fr` entry in the `LANGS` array at the top of `build.js`. The hreflang tags, the `x-default` link, and the language-switcher flags (nl/en/fr) are generated automatically by `build.js` for every language listed there — no per-file HTML editing needed. Push — Cloudflare rebuilds and deploys `dist/fr/index.html` automatically.

## Ongoing costs

- GitHub: free (public repo).
- Cloudflare Pages: free (well within free-tier limits for a site this size).
- Hostnet: just the annual domain registration fee, as today.
