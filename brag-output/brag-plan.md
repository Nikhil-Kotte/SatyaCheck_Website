# SatyaCheck — brag plan

**What it is:** A voice-clone scam detector that tells you if the caller is really your family member and explains why.
**For:** Indian families, especially elderly parents on UPI, and the adult children who set it up for them.
**What sets it apart:** It fuses three signals (identity, authenticity, intent) and cites its evidence. It also knows that a synthetic voice alone isn't a crime, so bank IVRs don't get flagged.
**Most impressive claim:** It hears a cloned son saying "Phone kisi ko mat dena, turant 50000 bhejo" and answers *FAKE VOICE DETECTED — DO NOT SEND MONEY*, citing an I4C advisory.
**Visual hook:** An incoming call from "Rahul (Son)", with the Hinglish transcript typing in.
**Real UI/flow:** Verdict card (red ✕ halo, Akira/Unbounded headline, Hindi warning), reason codes with citations, spoof timeline, bank-IVR "unverified" grey band. All copy and numbers come from `web/src/api/mock.ts`.
**Tone:** `cinematic`, restrained. Uses the app's Vanta-black dark theme.
**Share caption:** "It's his voice. It isn't him."

## Angle
Open cold on the scam call itself. The voice is familiar and the request is urgent. Then SatyaCheck takes it apart signal by signal. The twist is the bank IVR: also synthetic, also fine. "AI voice isn't the crime. The ask is."

## Visual identity
- bg #000 / surface #07080B / #141822, borders rgba(255,255,255,.14)
- danger #FF3B30, success #30D158, warning #FF9F0A, accent #38BDF8
- Display: Unbounded 800 (the app's font-akira fallback). Body: Plus Jakarta Sans. Mono: JetBrains Mono

## Storyboard (30fps, 1920×1080, 22.0s)
| # | t | Scene | On screen |
|---|---|---|---|
| 1 | 0.0–3.4 | Hook: incoming call | Phone card "Rahul (Son) · incoming call" with pulsing rings; transcript types "Papa emergency ho gaya hai, police ne pakad liya hai!" |
| 2 | 3.4–6.2 | Reveal | "It's his voice." then "It isn't him." (red) → dip → SatyaCheck wordmark + "Verify the voice, not just the number." |
| 3 | 6.2–9.8 | Three signals | Three cards stagger in: Identity (match · Rahul (Son)), Authenticity (98% peak synthetic · 6.5s run), Intent (isolation + urgent UPI). Spoof timeline bars grow |
| 4 | 9.8–13.2 | It explains itself | Transcript line 2 with markers highlighted ("Phone kisi ko mat dena" = isolation, "turant 50000 bhejo" = urgent UPI) + reason-code card citing I4C, MHA |
| 5 | 13.2–16.4 | Verdict | Real verdict card: ✕ halo, trust score counts 100→12, "FAKE VOICE DETECTED — DO NOT SEND MONEY", Hindi warning |
| 6 | 16.4–19.4 | Twist: bank IVR | HDFC IVR transcript, "72% synthetic" chip, grey ℹ "AUTOMATED CALL — NO SCAM DETECTED". Caption: "AI voice isn't the crime. The ask is." |
| 7 | 19.4–22.0 | Outro | SatyaCheck wordmark, "Hindi · English · Hinglish · runs offline", "Report to 1930 in seconds" |

## Sound
D minor, 120 BPM (beat = 0.5s). Scene 1: muted phone ring made from D/F tones over a low drone. Riser into the reveal, sub impact on "It isn't him." Scenes 3–4: pulse bass plus soft ticks on each card. Scene 5: low hit on the verdict. Scene 6: the pad opens up to D major (relief). Outro: sustained chord that fades.
