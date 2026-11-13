# Known issues

- **Wosker is missing.** Display type renders in Chakra Petch. Fix: drop `Wosker.otf` into `public/fonts/`.
- **Shell, Gallery and Notes have no real media.** They show live demos. Upgrade: add screenshots or
  recordings to `public/media/` and switch the registry entry to `screenshots` or `recording`.
- **The scatter word overlaps room content while pinned.** Same as the reference; it uses a difference
  blend to stay readable.
- **Portrait layout is written but was not checked on a phone.**
- **Reduced motion was written for every path but not checked in the browser.**
- **The figures in `systemRegistry.ts` are typed by hand** from the V/AS README (version 6.3.4). They
  go stale when V/AS grows.
- **No deploy target and no git repository yet.**
