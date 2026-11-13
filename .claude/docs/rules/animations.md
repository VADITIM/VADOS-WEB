# Animation rules

- V/AS `animation/` is binding. Durations live in `motionConstants.ts`.
- Text arrives by bar sweep (`Sweep-Label`) or mask lift (`Lift-Text`). Display type lifts per
  character, headings per word, prose as one block.
- A reveal plays once. Scrolling back never replays it.
- Every ScrollTrigger is created inside `registerScrollSetup`.
- Scrubbed tweens use `ease: 'none'`; played tweens ease `out` in and `in` out.
- A timeline that can be interrupted is stored and killed whole before the next one is built.
- Every motion path has a reduced branch: `isReducedMotion()` returns the final state at once. Typed
  text still types; the smoother, pins, scrubs and the liquid trail are skipped.
- Feedback (press, hover, toggle) is CSS on the state or a tween at control tempo, never gated behind a
  running reveal.
