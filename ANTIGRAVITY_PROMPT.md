# Prompt for Antigravity

Copy the four files `00-site-spec.md`, `01-setup-and-theme.md`, `02-component-map.md` and `03-motion-components.md` into `docs/ui/` in the project folder first. Then paste everything below the line into Antigravity.

---

Build the SatyaCheck marketing website. The full specification is in `docs/ui/`. Read all four files completely before writing any code, in this order:

1. `docs/ui/00-site-spec.md`: every page, section, piece of copy and content rule. This is the source of truth for what the site says.
2. `docs/ui/01-setup-and-theme.md`: stack, install steps, theme tokens, and which KokonutUI components to install.
3. `docs/ui/02-component-map.md`: which animation or component goes in which section, what is deliberately excluded, and the motion rules.
4. `docs/ui/03-motion-components.md`: source code for our own motion components. Create each file exactly at its stated path. You may fix genuine bugs, but do not redesign them.

If a project from an earlier version of this brief already exists in this folder, upgrade it in place and keep `src/content.ts`. Otherwise start a new Vite + React + TypeScript project here.

## How to work
1. Set up the stack and theme (file 01). Confirm the dev server runs.
2. Add our motion components (file 03) and install the five KokonutUI components (file 01, step 5). Open each KokonutUI file and adapt it as file 02 describes: brand colours through the theme variables, no fixed widths that break at 375px, reduced-motion support where missing, no leftover demo content. Keep their MIT header comments.
3. Put all editable text, links and placeholders in `src/content.ts`, and build the sections in the order given in file 00, using the components file 02 assigns to each.
4. Build `/privacy`, the forms and the Apps Script backend (file 00).
5. Verify, then report.

## Rules
- Content: use the copy in file 00 verbatim. No em dashes in visible text. No invented statistics, testimonials, logos, user counts or people. Placeholders stay clearly bracketed in `content.ts`.
- Motion: follow the five motion rules at the end of file 02. If you are unsure whether an effect is too much, leave it out.
- Do not install other UI or animation libraries. Do not use anything from motion.dev's paid Motion+ catalogue.
- Light mode only.

## Done when
- `npm run build` passes with no TypeScript or lint errors.
- You have taken screenshots at 375px, 768px and 1440px, checked them, and fixed anything broken or cramped.
- With reduced motion turned on, the site is fully usable and nothing loops or moves on scroll.
- Keyboard-only navigation works for the menu, tabs, carousel, accordion, modal, segmented toggle and forms.
- Forms show loading, success and error states, and the toast appears.
- Lighthouse on mobile scores 90+ on all four categories. If not, list what is holding it back.
- The README covers: run locally, fill in `content.ts`, set up the Google Sheet and Apps Script, deploy to Vercel, connect a custom domain.

Finish with a short report: what you built, which KokonutUI components you changed and how, any deviations from the spec and why, and what the team still has to fill in.
