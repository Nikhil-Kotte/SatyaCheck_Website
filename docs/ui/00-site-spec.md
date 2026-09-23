# 00. Site spec: pages, content and rules

Everything visible on the site comes from this file. Use the copy verbatim, fix only obvious typos, never use em dashes, and never add statistics, testimonials, logos, user counts or claims that are not listed here. All team-editable values live in `src/content.ts`.

## Pages
- `/` landing page (sections below, in order)
- `/privacy` privacy policy

## Brand
Cream background #FDFAE7, cobalt accent #1E2BFA, ink text #111111, muted text #6B6B6B. Space Grotesk for headings, Inter for body. Cards: 16px radius, 1px cobalt border at 20% opacity, tinted cobalt at 4 to 8%. Calm, spacious, trustworthy. Mobile first (375px, 768px, 1440px).

## 1. Header
Logo text "SatyaCheck". Links: How it works, For banks, Privacy, FAQ. Button: Join the waitlist.

## 2. Hero
- Eyebrow: Voice-clone scam protection
- Headline: Is that really your [son / daughter / brother / friend] on the phone?
- Subheadline: SatyaCheck checks the voice, the speech and what the caller is asking for, then tells your parents whether to trust the call, with the reason on screen.
- Primary button: Join the waitlist
- Secondary button: Watch the 60-second demo
- Trust line: Built by engineering students in Hyderabad. Selected for the Eureka! 2026 zonal round, E-Cell IIT Bombay.
- Visual: the animated verdict card ("Illustrative screen" caption).

## 3. Problem (id="problem")
- Headline: Cloning a voice takes seconds. Losing savings takes one call.
- Stat card: "3 seconds" / As little as 3 seconds of audio can produce an 85% voice match. / Source: McAfee, 2023
- Steps:
  1. A public clip: A reel, a voice note, a video.
  2. A cloned voice: Free tools, minutes of work.
  3. The call: "Papa, I'm in trouble. Don't tell anyone."
  4. The transfer: UPI moves the money in seconds.
- Closing line: Caller ID checks the number. Your ears check the voice. Scammers now beat both.

## 4. How it works (id="how-it-works")
- Eyebrow: How it works
- Headline: Three checks. One clear answer.
- Subheadline: One fake can fool one check. Fooling all three at once is much harder.
- Steps:
  - Is it the person? We compare the voice with a short sample your family member recorded, with consent.
  - Is the speech real? We look for the acoustic fingerprints that AI-generated voices leave behind.
  - Is it a known scam? We match the conversation against real Indian scam scripts: digital arrest, KYC fraud, family emergency, and more.
- Band: Every warning tells you why. We quote the exact line that matched a known scam, so you can decide for yourself.

## 5. Demo (id="demo")
- Headline: See it catch a scam
- Caption: A genuine call stays green. A cloned voice gets flagged. A real person reading a scam script gets flagged too.
- Video from `DEMO_VIDEO_URL`; if empty, a "Demo video coming soon" placeholder.

## 6. What your family sees
- Headline: Clear answers, not confusing scores
- Verified: This matches the person you enrolled. No scam signs.
- Be careful: Something is unusual. Verify before acting.
- High risk: Do not send money or share an OTP. Call them back directly.
- Unverified: We don't know this caller. That doesn't mean they're safe.
- Note: We never show green for a stranger, because we haven't verified anyone.

## 7. For banks and telcos (id="for-banks")
- Eyebrow: For banks and telcos
- Headline: Protect your customers before the money moves
- Body: Most people who need this will never install a security app. You already reach them. SatyaCheck plugs into your app so customers are protected during the call, not after the complaint.
- Points:
  - Warnings arrive during the call, before a transfer is approved.
  - Every alert carries its evidence, useful for your fraud team.
  - Built for Indian languages and Indian scam patterns.
- Flow diagram: Bank, then SatyaCheck, then Customers, with a return arrow "Fewer fraud cases and complaints".
- Button: Talk to us about a pilot. Opens a form: name, organisation, role, email (all required), submitted with type "pilot".

## 8. Where we are
- Eyebrow: Status
- Headline: Early, and honest about it
- Done: A working prototype that combines all three checks. A fine-tuned voice detector tested on recordings from speakers it never saw in training.
- In progress: Testing on real phone-call audio, which is much harder than studio recordings.
- Next: A pilot with a bank or cyber-crime cell.
- Line: We publish our limits as well as our results. Ask us for the numbers.

## 9. Privacy summary
- Headline: Built to protect privacy, not collect it
- Voiceprints, not recordings. An enrolled voice is stored as numbers that can't be played back.
- Consent first. Nobody is enrolled without agreeing, and anyone can delete their voiceprint.
- No call recordings kept. Audio is analysed and discarded.
- Designed for India's DPDP Act.
- Link: Read our privacy policy
- Code comment: TODO(team): confirm "No call recordings kept" matches the product before launch. Do not change to "compliant" without legal review.

## 10. Team
- Headline: The team
- Four cards from a `TEAM` array: name, role, one-line achievement, optional photo (fallback: initials in a cobalt circle), optional LinkedIn. Fill with bracketed placeholders. Never invent people or achievements. Advisors row only if `ADVISORS` is non-empty.

## 11. FAQ (id="faq")
- Does the caller need to install anything? No. Only the person being protected opts in.
- Does it work in Hindi and Telugu? The scam-matching works in Hindi, English and Hinglish today. More languages are planned.
- Is it available now? Not yet. Join the waitlist and we'll tell you when pilots open.
- Will it ever block a real call? No. SatyaCheck warns; you decide.
- What happens to my voice data? It's stored as a voiceprint, never a recording, and you can delete it anytime.

## 12. Waitlist (id="waitlist")
- Headline: Protect the people who pick up the phone
- Body: Join the waitlist for early access, or tell us about a parent who almost got scammed. Every story helps us build this right.
- Fields: name (required); phone or email (required; valid email or 10-digit Indian mobile); city (optional); I am a: parent, son or daughter (a grown-up child protecting their parents), bank or organisation, other (required); your story (optional).
- Consent checkbox (required): I agree to be contacted about SatyaCheck and have read the privacy policy.
- Button: Join the waitlist. States: loading, success ("You're on the list. Thank you."), error with retry. Hidden honeypot field.

## 13. Footer
Logo, contact email (`CONTACT_EMAIL`, with copy button), LinkedIn (`LINKEDIN_URL`, hidden if empty), link to /privacy, "© 2026 SatyaCheck. Built in Hyderabad."

## /privacy
Plain-language policy: what the waitlist and pilot forms collect, why, where it is stored (a Google Sheet accessible only to the founding team), how long it is kept, how to request deletion (email CONTACT_EMAIL), last-updated date. Code comment: TODO(team): review before launch.

## Forms backend
All forms POST to `FORM_ENDPOINT` (or `VITE_FORM_ENDPOINT`) with a "type" field ("waitlist" or "pilot") and a timestamp. Default: a Google Apps Script web app appending to two tabs of a Google Sheet. Put its code in `apps-script/Code.gs`, send the body as text/plain to avoid CORS preflight, and document deployment in the README. No real URLs, keys or emails in code.

## SEO and sharing
- Title: SatyaCheck: Know if the voice on the phone is real
- Description: Voice-clone scams target families. SatyaCheck checks the voice, the speech and the script, and warns you during the call.
- Open Graph and Twitter tags; a 1200x630 OG image (cream background, cobalt headline "Is that really your son on the phone?"); favicon: cobalt rounded square with a white check.
- Placeholder for privacy-friendly analytics, off by default.

## Accessibility and quality
Semantic HTML, visible focus states, labelled fields, WCAG AA contrast, full keyboard support for menu, accordion, tabs, carousel and modal. Lighthouse 90+ on performance, accessibility, best practices and SEO on mobile.
