# Frontend rules

- Tokens come from `variables.scss`. A hex or a duration typed into a component is a bug.
- Landscape and portrait are two layouts: `@include verticalLayout` in SCSS. A change to one is not a
  change to the other.
- Hover effects sit inside `@include finePointer`. Pointer-following behaviour checks
  `event.pointerType === 'mouse'`.
- One hover for every text control: the accent fill sweeps in from the left and the text takes the ink
  colour (`.sweep-control`, `.project-row`).
- One primary action per room: the filled `.sweep-control.is-primary`.
- Text on an accent slab uses `$accent-ink`, decided by `inkFor`.
- Split text keeps the full string in a `.visually-hidden` span; the pieces are `aria-hidden`.
- A new face is registered in `fonts.scss` and given a role in V/AS first.
