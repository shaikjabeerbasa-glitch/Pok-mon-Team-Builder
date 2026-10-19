# Verification record

Executed on 19 October 2026 using the local Vite server, Chromium through temporary Playwright tooling, and live PokéAPI responses. These are observed results, not claims of cross-browser certification.

## Executed and passed

- `npm run build`: production bundle completed successfully.
- `npm run lint`: no reported warnings or errors.
- Initial page: exactly 20 cards, Bulbasaur first, all 20 sprite images loaded.
- Previous disabled on page one; next page began with Spearow; previous returned to Bulbasaur.
- Details dialog: six stats, Bulbasaur height 0.7 m and weight 6.9 kg; Escape and close button dismissed it.
- Added six Pokémon; duplicate showed an informative message; seventh showed `Your team is full!`; count remained six.
- Reload restored the team; removing Bulbasaur reduced occupied slots to five.
- Name search accepted `  PIKACHU  `; numeric ID `25` independently completed and returned Pikachu.
- Invalid name showed `Pokémon not found.`; clearing returned the list; search preserved the team.
- Fire filter returned Charmander; clearing filter restored all Pokémon.
- Simulated network failure showed the friendly connection error; clearing search recovered.
- Delayed list response showed `Loading...` and disabled pagination.
- Delayed Eevee response could not replace a newer Mew search result.
- Corrupt localStorage JSON restored an empty team without crashing.
- Simulated failed sprite request displayed the accessible image fallback.
- No horizontal overflow at viewport widths 320, 390, 768, and 1024 px; desktop tested at 1440 px.
- Mobile detail open/close actions worked.
- No browser `pageerror` events during the main flow.
- Desktop/mobile screenshots captured and inspected; see `docs/screenshots/`.

Playwright and the formatter were installed outside the project in a temporary directory. The app has no browser-test or formatter runtime dependency.

## Manual regression checklist

1. Run `npm install` and `npm run dev`, then open the printed URL.
2. Inspect 20 images and names; navigate next/previous and verify the page number.
3. Search `Pikachu`, `PIKACHU`, `pikachu`, `  Pikachu  `, and `25`; clear each search.
4. Search a made-up name, then retry or clear; check the exact 404 message.
5. Open details with keyboard and pointer; verify types, measurements and six labelled stat bars.
6. Add six different Pokémon; try a duplicate and a seventh; remove one and add another.
7. Search/page/filter while keeping your team, then reload and check persistence.
8. Filter several types and navigate their pages; check the type summary for dual-type members.
9. In browser developer tools, throttle or block PokéAPI and sprites; verify loading, friendly errors, retry, and image fallback.
10. Tab through controls, open the modal, verify focus stays within it, press Escape, and verify focus restoration.
11. Check narrow phones, tablets, desktop, zoomed text, and reduced motion.
12. Run `npm run build` and `npm run lint` before submission.

## Not verified

Safari/Firefox, screen-reader announcements, a full accessibility audit, every Pokémon/form/type, storage quota failures, all HTTP status variants, and hosted deployment have not been tested. No GitHub push or deployment was performed.
