# SatyaCheck — Voice-Clone Scam Protection (Version 2)

Production-ready marketing website for **SatyaCheck**, an Indian startup building real-time voice-clone scam call detection for families, banks, and telcos.

Selected for the Eureka! 2026 zonal round, E-Cell IIT Bombay. Built by engineering students in Hyderabad.

---

## What's New in Version 3

A full visual redesign. Content rules from `docs/ui/00-site-spec.md` still apply (no invented stats, testimonials or people; no em dashes in visible copy).

- **Light and dark themes.** A sun/moon toggle in the header and footer. The first visit follows the OS setting; a manual choice is saved in `localStorage` (`sc-theme`). The new theme grows out of the toggle as a circle (View Transitions API, with an instant fallback). An inline script in `index.html` applies the theme before first paint, so there is no flash.
- **Design tokens.** Every colour is a CSS variable in `src/index.css` (`canvas`, `surface`, `fg`, `brand`, `line`, `ok`, `warn`, `risk`...), exposed to Tailwind in `tailwind.config.js`. Change a colour in one place and both themes follow.
- **Type.** Inter Tight (headlines), Inter (body), Instrument Serif italic (accent words, written as `*word*` in headings), JetBrains Mono (labels).
- **3D, built on three.js with custom shaders** (`src/components/three/`):
  - `VoiceOrb`: the hero's particle sphere that ripples like a voice speaking, with two scanning rings. It leans toward the cursor.
  - `SignalField`: receding waveform lines with a sweeping scan line, behind the How it works panel.
  - Both load in their own chunk after first paint, pause when off screen or when the tab is hidden, and render one still frame under reduced motion.
- **Scroll video story** (`#story-scroll`): a pinned section with story-style progress segments, clickable chapters, and a mood glow that shifts from danger to relief. It has a **sound toggle**: after the visitor taps it, every clip plays with sound. Video pauses whenever the section leaves the screen.
- **Motion.** Lenis smooth scrolling, word-by-word headline reveals, magnetic buttons, 3D tilt cards, cursor spotlights, pulsing status dots, a scroll progress bar, an auto-cycling pipeline console, count-up stats and a scroll-lit statement line. All of it is off under `prefers-reduced-motion`.

### Story videos

Source renders live in `videos/` (not served). The site uses processed copies in `public/videos/`:

| File | Source | Processing |
|---|---|---|
| `story-1.mp4` | `videos/1.mp4` | First 0.75 s cut (the dissolve from the living-room shot), original audio replaced with a synthesised sound-design track (`scratch/story1_audio.py`), normalised to -19 LUFS; 9.25 s |
| `story-2.mp4` | `videos/2.mp4` | Unchanged, sound kept (faststart) |
| `story-3.mp4` | `videos/3.mp4` | Last 10 s only; its near-silent audio is mixed with a synthesised tension bed (`scratch/story3_audio.py`: clock, heartbeat, drone, bangles) and the caller's voice (`videos/story3-voice.wav`, generated in Google AI Studio) with a phone-speaker effect |
| `story-4.mp4` | `videos/4.mp4` | Original audio replaced with synthesised music (`scratch/story4_audio.py`): an unresolved pad that resolves as the light rings appear, with bells on each ring pulse |
| `story-5.mp4` | `videos/5.mp4` | Last 10 s only (cut at the scene change, 9.9 s), sound kept |

Each clip has a matching `.webp` poster. To regenerate them (requires ffmpeg):

```bash
python scratch/story1_audio.py story1.wav   # needs numpy + scipy
ffmpeg -ss 0.75 -i videos/1.mp4 -ss 0.75 -i story1.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -pix_fmt yuv420p -af "afade=t=in:d=0.08,loudnorm=I=-19:TP=-2:LRA=11" -c:a aac -b:a 160k -shortest -movflags +faststart public/videos/story-1.mp4
ffmpeg -i videos/2.mp4 -c copy -movflags +faststart public/videos/story-2.mp4
python scratch/story3_audio.py story3.wav videos/story3-voice.wav 0.9   # caller voice (Google AI Studio TTS), starting at 0.9 s
ffmpeg -sseof -10 -i videos/3.mp4 -i story3.wav -filter_complex "[1:a][0:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-18:TP=-2:LRA=11,alimiter=limit=0.75:level=false[a]" -map 0:v -map "[a]" -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k -shortest -movflags +faststart public/videos/story-3.mp4
python scratch/story4_audio.py story4.wav
ffmpeg -i videos/4.mp4 -i story4.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-19:TP=-2:LRA=11,alimiter=limit=0.75:level=false" -c:a aac -b:a 160k -shortest -movflags +faststart public/videos/story-4.mp4
ffmpeg -ss 10.1 -i videos/5.mp4 -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/videos/story-5.mp4
```

Story copy, chapter labels, `hasAudio` flags and mood tones are in `STORY_STEPS` in `src/content.ts`.

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Animations / Motion**: `motion` (free MIT version), `lenis` (smooth scroll)
- **3D**: `three` (custom GLSL shaders, lazy-loaded)
- **Styling**: Tailwind CSS with theme-aware CSS variable tokens (light: cream `#FDFAE7` + cobalt `#1E2BFA`; dark: deep navy + electric cobalt)
- **Routing**: React Router (`/`, `/hi`, `/te`, and `/privacy`)
- **Icons**: Lucide React
- **Backend / Forms**: Google Apps Script Web App writing to dual Google Sheets tabs ("Waitlist" and "Pilots")
- **Hosting**: Static build deployable with zero config to Vercel or Netlify

---

## 1. Quick Start (Run Locally)

### Prerequisites
- Node.js (v20.19 or higher; Vite 8 requires it)
- npm (v9 or higher)

### Steps
```bash
# 1. Clone repository (Node.js 20.19+ required)
git clone https://github.com/Nikhil-Kotte/SatyaCheck_Website.git
cd SatyaCheck_Website

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 2. Managing Content (`src/content.ts`)

All editable website copy, links, team members, contact information, and placeholders are centralized in **`src/content.ts`**. Non-developers can safely update content without modifying React components:

- **`HERO_SCREENSHOTS`**: Array of app screenshot paths (e.g. `["/screens/verdict.webp"]`). If empty, the site falls back to the interactive `VerdictCard` call simulation.
- **`STORY_STEPS`**: 5-step video scroll story steps, poster images, headlines, and alt texts.
- **`VIDEO_CREDIT`**: Caption line acknowledging AI illustrations.
- **`PIPELINE`**: Real-time status chips for detection pipeline (Working, In testing).
- **`AUDIENCE_CONTENT`**: Content for Families, Banks, and Cyber Cells/NGOs.
- **`STORY_TEXT` & `STORY_VIDEO_URL`**: Founders' mission statement and pitch embed.
- **`WHATSAPP_NUMBER` & `PHONE_NUMBER`**: Direct contact numbers.
- **`FORM_ENDPOINT`**: Your deployed Google Apps Script web app URL (or via `.env` variable `VITE_FORM_ENDPOINT`).
- **`DEMO_VIDEO_URL`**: YouTube / Vimeo embed URL for the full demo. While it is empty, the Demo section plays the 24-second trailer from **`DEMO_TRAILER`** (`public/videos/trailer.mp4`, exported from `brag-output/brag.mp4`).
- **`PROBLEM`, `WHY_NOW`, `USER_FLOW`, `BLIND_SPOTS`, `VALIDATION`, `COMPETITORS`**: content from the Eureka! 2026 pitch deck (the problem and its numbers, why today's fixes fall short, why now, the four-step user flow, the blind-spot matrix, test results and surveys, and the competitor comparison). Every figure keeps its source; update them together with the deck.
- **`CONTACT_EMAIL`**: Contact email for inquiries and privacy requests.
- **`LINKEDIN_URL`**: Company or founder LinkedIn URL. Automatically hidden in footer if empty.
- **`TEAM`**: The four co-founders with a one-line background each, and optional `photoUrl` (initials show when empty) and `linkedinUrl`.
- **`ADVISORS`**: Optional array of advisors. Rendered only when entries are added.

---

## 3. Setting Up Google Sheets Backend (Apps Script)

The website includes a ready-to-use Google Apps Script handler in `apps-script/Code.gs` that automatically records form submissions into two tabs: **Waitlist** and **Pilots**.

### Step-by-Step Setup:
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet (e.g. named `SatyaCheck Submissions`).
2. In the menu, go to **Extensions > Apps Script**.
3. Replace any default code in the editor with the entire contents of [`apps-script/Code.gs`](apps-script/Code.gs).
4. Click **Save** (disk icon).
5. Click **Deploy > New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Configure:
   - **Description**: `SatyaCheck Production Endpoint`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` (essential so website visitors can submit)
8. Click **Deploy**, authorize permissions when prompted, and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).
9. Paste this URL into `src/content.ts` as `FORM_ENDPOINT` or set it in your `.env`:
   ```bash
   VITE_FORM_ENDPOINT="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   ```

### CORS & Spam Handling:
- Requests are transmitted with `Content-Type: text/plain;charset=utf-8` and `mode: 'no-cors'` to avoid browser preflight restrictions with Google Apps Script.
- The form includes a hidden honeypot field (`website_url_hp` / `user_web_hp`) to discard automated spam submissions silently.

---

## 4. Deploying to Vercel (step by step, from nothing)

Everything Vercel needs is already in the repo: `vercel.json` sets the build command, the output folder, single-page-app routing (so `/privacy` works on refresh), caching and security headers. `package.json` pins Node 20.19 or newer, which Vite 8 needs.

### Before you start
- A **GitHub** account with this repository pushed to it (step 1).
- A **Vercel** account. Sign up free at [vercel.com/signup](https://vercel.com/signup) and choose **Continue with GitHub**, which links the two accounts.
- Optional but recommended: the **Google Apps Script URL** from section 3, so the forms save to your Google Sheet from day one. Without it the forms still show a success message but nothing is stored.

### Step 1: Push the code to GitHub
The repository's remote is `https://github.com/Nikhil-Kotte/SatyaCheck_Website`.

1. If that repository does not exist on GitHub yet, create it at [github.com/new](https://github.com/new) with the same name. Leave **"Add a README"**, **.gitignore** and **license** unticked, so the repository starts empty.
2. From the project folder, push:
   ```bash
   git push -u origin main
   ```
3. Refresh the GitHub page. You should see `src/`, `public/`, `vercel.json` and the rest.

### Step 2: Import the project into Vercel
1. Open the [Vercel dashboard](https://vercel.com/dashboard) and click **Add New... > Project**.
2. Under **Import Git Repository**, find `SatyaCheck_Website` and click **Import**.
   - If it is not listed, click **Adjust GitHub App Permissions**, give Vercel access to the repository, and come back.
3. On the **Configure Project** screen, check these values (they should already be filled in):
   | Setting | Value |
   |---|---|
   | Framework Preset | **Vite** |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

### Step 3: Add the form endpoint
Still on the Configure screen, open **Environment Variables** and add:

| Key | Value | Environments |
|---|---|---|
| `VITE_FORM_ENDPOINT` | your Apps Script web app URL, e.g. `https://script.google.com/macros/s/.../exec` | Production and Preview |

Vite bakes this value into the site **at build time**. If you add or change it later, go to **Deployments**, open the latest one, and click **Redeploy** for the change to take effect. See `.env.example` for local development.

### Step 4: Deploy
1. Click **Deploy**. The first build takes about a minute.
2. When it finishes, Vercel shows a preview image and a URL like `satyacheck-website.vercel.app`. Open it.

### Step 5: Check the live site
- The page loads in light or dark mode (matching your device), and the sun/moon toggle switches it.
- In the story section, tap **Tap for sound**. All five clips should play with sound as you scroll.
- Open `/privacy` directly in the address bar and refresh. It should load, not show a 404.
- Submit the waitlist form with test details. A row should appear in the **Waitlist** tab of your Google Sheet. Delete it afterwards.
- Open the site on a phone, in portrait and landscape.

### Step 6: Automatic deployments
From now on, you do not need to deploy by hand:
- Every push to `main` deploys to production automatically.
- Every other branch and every pull request gets its own **preview URL**, so you can review changes before merging.
- To undo a bad release: **Deployments**, pick an earlier deployment, **...** menu, **Promote to Production**.

### Step 7: Connect your domain (`satyacheck.in`)
1. In the project, open **Settings > Domains** and add `satyacheck.in`. When asked, also add `www.satyacheck.in` and choose to **redirect `www` to `satyacheck.in`**.
2. Vercel then shows the exact DNS records to create. Add them at your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger...) under DNS settings. They are usually:
   - an **A** record for `@` pointing to the IP address Vercel shows, and
   - a **CNAME** record for `www` pointing to the `...vercel-dns.com` target Vercel shows.

   Use the values from the dashboard rather than copying them from here, because Vercel occasionally changes them.
3. DNS can take from a few minutes to a few hours to update. The Domains page shows **Valid Configuration** when it is working, and Vercel issues the HTTPS certificate automatically.
4. **If you use a different domain**, update `https://satyacheck.in` in `index.html` (the `og:url`, `og:image` and `twitter:image` tags), `public/sitemap.xml` and `public/robots.txt`, so link previews and search engines point to the right place.

### Deploying from the command line instead (optional)
```bash
npm i -g vercel
vercel login
vercel link                        # connect this folder to a Vercel project
vercel env add VITE_FORM_ENDPOINT  # paste the Apps Script URL when asked
vercel                             # preview deployment
vercel --prod                      # production deployment
```

### Troubleshooting
| Problem | Fix |
|---|---|
| Build fails mentioning the Node version or `engines` | **Settings > Build and Deployment > Node.js Version**: choose **22.x**, then redeploy. |
| Forms say "success" but the Sheet stays empty | `VITE_FORM_ENDPOINT` is missing or wrong, or you did not redeploy after adding it. Also check that the Apps Script deployment has **Who has access: Anyone**. |
| `/privacy` shows a 404 after refresh | `vercel.json` is missing from the deployed commit. Check it is committed and pushed. |
| Videos do not load | Check that `public/videos/story-*.mp4` are committed. They are small (under 3 MB each), so Git LFS is not needed. |
| Link previews show an old image | Social apps cache previews. Re-scrape with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or the LinkedIn Post Inspector. |

---

## 5. Deploying to Netlify (Zero Config)

1. Connect your repository on [Netlify](https://app.netlify.com).
2. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. The included `public/_redirects` file automatically handles single-page app routing.

---

## 6. Build & Verification
To test a production bundle locally:
```bash
npm run build
npm run preview
```
To run linting:
```bash
npm run lint
```
