# VAD/OS Web

This project is built on V/AS (VAD/OS APPLICATION SYSTEMS). Read SKILL.md in the V/AS clone (see ~/.claude/CLAUDE.md).

The product presentation of V/AS and every VAD/OS product: one scrolling page, one room per product,
each product shown through its real media or a live demo of its strongest mechanic. The reference for
pacing and mechanics is https://www.noth.in.

## Stack

Vue 3 · TypeScript · SCSS · GSAP (ScrollTrigger, ScrollSmoother) · Vite. Nothing else.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run typecheck` | `vue-tsc` against `tsconfig.app.json` |
| `npm run build` | Typecheck, then build to `dist/` |

Releases: on command.

## Key rules

- A product, a project or a law is added in its registry under `src/modules/`, never in a component.
- A leaf component never names a colour. It reads `$accent` and `$accent-ink` from the room it is in.
- Text arrives through `Sweep-Label` or `Lift-Text` and is revealed once by `useSectionReveal`.
- Every scroll-driven setup goes through `registerScrollSetup`, so it is created after the smoother.
- No comments, no abbreviated names (V/AS module 09). Reasons go to `docs/`.

## Docs

@docs/map.md
@docs/rules/frontend.md
@docs/rules/animations.md

`docs/architecture.md`, `docs/decisions.md`, `docs/quirks.md`, `docs/known-issues.md`, `docs/roadmap.md`.
