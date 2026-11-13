# VAD/OS Web

The product presentation of V/AS (VAD/OS Application Systems) and the VAD/OS products built on it:
Shell, Terminal, Bubble, Gallery, Files, Notes and VAD/OS.

Vue 3, TypeScript, SCSS and GSAP.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Products, projects and the system facts are data in `src/modules/*Registry.ts`. Adding a product is
one registry entry plus its media in `public/media/`.

The display face (Wosker) is not redistributable. Drop `Wosker.otf` into `public/fonts/`; without it
titles fall back to Audiowide.

Space Mono and Audiowide are under the SIL Open Font License; see `public/fonts/`.
