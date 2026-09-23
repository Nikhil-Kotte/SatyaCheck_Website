# 05. Version 2 changes (overrides earlier files where they conflict)

References: eéna (full-width pinned scroll story with vertical product videos), Bermer (status badge, product screenshots, audience chooser, technical panel with status tags, founder story, contact block, language switcher, footer columns), Niyantha (infrastructure positioning for the bank section). Do not copy any of their assets, text or code.

## 1. Layout: use the full width
- Sections span the full viewport width. No boxed page container.
- Horizontal padding everywhere: `clamp(20px, 5vw, 96px)`. Text blocks keep a readable max width (about 70 characters), but grids, media and backgrounds run edge to edge.
- Large type scale: section headlines `clamp(40px, 5.2vw, 88px)`, bold, tight line height.
- Background stays cream (#FDFAE7). Cobalt (#1E2BFA) is the only accent, including the glowing scroll dot.
- No intro splash or logo animation before the page loads.

## 2. New section order
1. Header (with language switcher)
2. Hero (status badge, product screenshots)
3. Scroll story (new, eéna-style, 5 steps with videos)
4. Under the hood (replaces the ScrollSpotlight "How it works"; keep the "Every warning tells you why" band after it)
5. Demo
6. What your family sees
7. Where do you fit (audience chooser; absorbs the old "For banks and telcos" section)
8. Where we are
9. Privacy summary
10. The story + Team
11. FAQ
12. Waitlist
13. Work with us (contact block)
14. Footer (columns)

The old "Problem" section is replaced by the scroll story. `ScrollSpotlight` is no longer used.

## 3. Hero changes
- Status badge above the headline: a small pill with a softly pulsing cobalt dot (static under reduced motion): **Early access: waitlist open**
- Headline, subheadline, buttons and trust line: unchanged from 00-site-spec.md.
- Right side: a stack of two or three overlapping, slightly rotated screenshots of the real SatyaCheck app (enrolment, verdict with evidence, the evidence panel). Paths from `HERO_SCREENSHOTS` in content.ts (e.g. `/screens/verdict.webp`). If the array is empty, show the `VerdictCard` animation instead.

## 4. Scroll story (id="story-scroll")
Component: `ScrollVideoStory` (04-scroll-video-story.md). Content lives in `STORY_STEPS` in content.ts.

| Step | Video file | Headline | Sub line |
|---|---|---|---|
| 1 | `/videos/scene-1-call.mp4` | Ever answered a call where your son sounded scared? | It was his voice. It might not have been him. |
| 2 | `/videos/scene-2-clone.mp4` | A few seconds of his voice is enough to copy it. | A reel, a voice note, a video. As little as 3 seconds of audio can produce an 85% voice match (McAfee, 2023). |
| 3 | `/videos/scene-3-pressure.mp4` | Then comes the pressure. | "Don't tell anyone. Send it now." A UPI transfer takes seconds and can't be pulled back. |
| 4 | `/videos/scene-4-check.mp4` | SatyaCheck listens with you. | It checks the voice, the speech and the script while the call is still going. |
| 5 | `/videos/scene-5-relief.mp4` | And tells you why. | The warning quotes the exact line that matched a known scam. You call your son back. He's fine. |

Each video needs a matching poster: same name, `.webp`. Videos are placeholders (AI-generated) and will be replaced. Encode as H.264 MP4, 720x1280, no audio track, under 3 MB each.

Alt texts (for `alt`): 1 "An older woman answers a phone call at home in the evening." 2 "An abstract visual of a voice waveform being copied." 3 "A hand holding a phone with a payment screen, hesitating." 4 "A phone on a table glowing softly during a call." 5 "The woman smiles on a video call with her son."

Footer credit line (content.ts `VIDEO_CREDIT`): **Story videos are AI-generated illustrations.** A scam-safety brand must not pass off generated people as real customers.

## 5. Under the hood (id="how-it-works")
A dark ink panel (#111111, cream text, rounded 28px) inside the cream page, like a control-plane card.

- Eyebrow: How it works
- Headline: Three checks. One clear answer.
- Tag in the panel corner: **Prototype**
- Rows, each with a number, title, one line, and a status chip:
  - 01 **Voice match.** Compares the caller with the family member's enrolled voiceprint. Status: Working
  - 02 **Synthetic speech check.** Looks for the acoustic fingerprints of AI-generated voices. Status: In testing
  - 03 **Scam-script match.** Matches the conversation against Indian scam scripts in Hindi, English and Hinglish. Status: Working
  - 04 **Fusion and evidence.** Combines all three and quotes the matched line as the reason. Status: Working
- Status chips come from content.ts (`PIPELINE`), with a code comment: `TODO(team): confirm each status matches the product on launch day.`
- Rows appear with `StaggerReveal`. Then the existing "Every warning tells you why" band.

## 6. Where do you fit (audience chooser)
Use `SegmentedToggle` (large size) to switch between three panels. Default: For families.

**For families**
- Headline: Protect your parents from calls that sound like you.
- Points: Enrol your voice once, with consent. / Warnings arrive during the call, with the reason on screen. / Early access is free for waitlist families.
- Button: Join the waitlist
- `TODO(team)`: confirm "free for waitlist families" before launch, or remove that point.

**For banks and telcos**
- Eyebrow line: The verification layer for voice calls.
- Headline: Stop fraud before the transfer, inside your own app.
- Body and three points: as in the old "For banks and telcos" section of 00-site-spec.md, plus its flow diagram.
- Button: Talk to us about a pilot (opens the pilot modal, type "pilot")

**For cyber cells and NGOs**
- Headline: Help the people you protect spot cloned-voice scams.
- Points: Pilot SatyaCheck with a community you already support. / Tell us which scam scripts you're seeing, so we can detect them. / Get early access to our findings on Indian voice scams.
- Button: Partner with us (opens the same modal, type "partner")

## 7. The story (before Team)
- Eyebrow: The story
- Headline: Why we're building this
- Body from content.ts `STORY_TEXT` (placeholder: "[Two or three sentences from the founders about why this matters to you.]")
- A 16:9 video embed from `STORY_VIDEO_URL` (the Eureka pitch recording later). If empty, hide the video and show text only.

## 8. Work with us (contact block, before the footer)
- Headline: Work with us
- Body: Talk to us about pilots, partnerships or research.
- Three buttons from content.ts: Email (`CONTACT_EMAIL`), Message on WhatsApp (`WHATSAPP_NUMBER`, opens wa.me), Call (`PHONE_NUMBER`). Hide any button whose value is empty.

## 9. Language switcher
- Header dropdown: English, हिन्दी, తెలుగు. Routes: `/`, `/hi`, `/te`.
- Content files: `content.ts` (English), `content.hi.ts`, `content.te.ts`. Translate only the hero, the scroll story and the waitlist form in phase 1; other sections fall back to English.
- **Do not machine-translate.** Leave the Hindi and Telugu files as bracketed placeholders for a native speaker to fill in. Hide a language from the switcher until its file has no placeholders left.
- Set `lang` on `<html>` per route.

## 10. Footer (columns)
Four columns plus a bottom line:
- Product: How it works, Demo, For families, For banks, Waitlist
- Company: The story, Team, Work with us, LinkedIn
- Legal: Privacy policy
- Languages: English, हिन्दी, తెలుగు (only languages that are live)
- Bottom: "© 2026 SatyaCheck. Built in Hyderabad." and the `VIDEO_CREDIT` line.

Keep `FooterReveal` only if the taller footer still fits in 80% of the viewport; the component already falls back automatically.
