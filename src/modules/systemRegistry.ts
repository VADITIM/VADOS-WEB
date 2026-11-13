export interface SystemLaw {
  title: string;
  detail: string;
}

export interface SystemFigure {
  value: number;
  label: string;
}

export interface SystemAccent {
  name: string;
  hex: string;
}

export const SYSTEM_VERSION = '6.3.4';

export const systemLaws: SystemLaw[] = [
  {
    title: 'The border is the design.',
    detail: 'Depth comes from a 1px hairline and translucency, never from a shadow.',
  },
  {
    title: 'One accent per screen, inherited from the root.',
    detail: 'A leaf component never names a colour.',
  },
  {
    title: 'Every element has a start, maybe a middle, and always an end.',
    detail: 'The end is faster, immediate, and never a reversed start.',
  },
  {
    title: 'A difference of amount is a ramp. A difference of kind is a branch.',
    detail: 'Widths are neither.',
  },
  {
    title: 'If you cannot name an animation’s intent, it does not ship.',
    detail: 'Arrival, departure, life or consequence.',
  },
  {
    title: 'Corners are squircle, and nothing else.',
    detail: 'Text takes no radius.',
  },
];

export const systemFigures: SystemFigure[] = [
  { value: 6, label: 'Laws' },
  { value: 15, label: 'Foundation modules' },
  { value: 28, label: 'Built components' },
  { value: 8, label: 'Platforms' },
];

export const systemAccents: SystemAccent[] = [
  { name: 'Terminal green', hex: '#5bfd5b' },
  { name: 'Sodium yellow', hex: '#FFDD1B' },
  { name: 'Electric blue', hex: '#0040ff' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Amber', hex: '#f09b3a' },
  { name: 'Violet', hex: '#8a2be2' },
];

export const systemPlatforms: string[] = [
  'Vue · GSAP',
  'Svelte · Tauri',
  'Android · Compose',
  'Android · Shizuku',
  'SwiftUI',
  'Qt · QML',
  'Godot',
  'CLI · TUI',
];
