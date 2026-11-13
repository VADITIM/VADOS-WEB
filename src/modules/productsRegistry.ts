export type ProductDemonstration =
  | { kind: 'screenshots'; images: string[] }
  | { kind: 'recording'; video: string }
  | { kind: 'liquid' }
  | { kind: 'live'; source: string; size: string; hint: string }
  | { kind: 'stack' }
  | { kind: 'ink' }
  | { kind: 'none' };

export interface Product {
  id: string;
  name: string;
  platform: string;
  stack: string;
  accent: string;
  headline: string;
  strengths: string[];
  repositoryUrl: string | null;
  availability: string;
  demonstration: ProductDemonstration;
}

const GITHUB = 'https://github.com/VADITIM';

export const products: Product[] = [
  {
    id: 'shell',
    name: 'Shell',
    platform: 'Arch · Wayland',
    stack: 'Quickshell · Qt 6 · QML',
    accent: '#0040ff',
    headline: "Full-screen sections, motion-based navigation.",
    strengths: [
      "Tactile UI components, built to be felt, not just scrolled through.",
    ],
    repositoryUrl: `${GITHUB}/VADOS-SHELL`,
    availability: 'Public',
    demonstration: {
      kind: 'live',
      source: 'shell-live/play.html',
      size: '19 MB',
      hint: 'G search · D dashboard · Ctrl+P settings',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    platform: 'Windows · Linux',
    stack: 'Tauri v2 · SvelteKit · Rust',
    accent: '#8a2be2',
    headline: "A Terminal focusing on UX.",
    strengths: [
      "GUI based Terminal with actual features over bloat with the power of CLI.",
      "Improve your Terminal sessions with readable output with support on markdown over markup.",
    ],
    repositoryUrl: `${GITHUB}/VADOS-TERMINAL`,
    availability: 'Public',
    demonstration: {
      kind: 'screenshots',
      images: ['media/terminal-3.png', 'media/terminal-1.png', 'media/terminal-4.png', 'media/terminal-5.png'],
    },
  },
  {
    id: 'bubble',
    name: 'Bubble',
    platform: 'Galaxy S25 · One UI 8',
    stack: 'Kotlin · WebView · Shizuku',
    accent: '#FFDD1B',
    headline: "Heavily animated and optimized Dynamic Island and System Tray overhaul for Android.",
    strengths: [
      "Features everything and more as Apple's own Dynamic Island.",
    ],
    repositoryUrl: `${GITHUB}/VADOS-BUBBLE`,
    availability: 'Public',
    demonstration: {
      kind: 'recording',
      video: 'media/bubble-latest.mp4',
    },
  },
  {
    id: 'gallery',
    name: 'Gallery',
    platform: 'Android · Arch',
    stack: 'Kotlin · Jetpack Compose · Qt 6',
    accent: '#DC143C',
    headline: "An image gallery for Android without the bloat.",
    strengths: [
      "Enjoy eye-guiding animations with features that matter for everyday use.",
    ],
    repositoryUrl: `${GITHUB}/VADOS-GALLERY`,
    availability: 'Public',
    demonstration: {
      kind: 'stack',
    },
  },
  {
    id: 'files',
    name: 'Files',
    platform: 'Arch · Hyprland',
    stack: 'Qt 6 · QML · C++',
    accent: '#f09b3a',
    headline: 'A file manager where every folder change is a menu transition.',
    strengths: [
      'Each place is a room with its own colour: Home green, Downloads blue, Trash crimson.',
      'Drag and drop onto folders, tabs, path segments and other apps, with a hint at the pointer.',
      'Quick look grows out of the tile it belongs to.',
      'Tabs, split view, a details column, deep search and undo.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-Files`,
    availability: 'Public',
    demonstration: {
      kind: 'screenshots',
      images: ['media/files-preview.png'],
    },
  },
  {
    id: 'notes',
    name: 'Notes',
    platform: 'iPad · Windows · Linux',
    stack: 'SwiftUI · Tauri · a shared Swift core',
    accent: '#5bfd5b',
    headline: 'Handwritten notes on iPad and desktop from one core and one token file.',
    strengths: [
      'Pen on a surface: ink, erase, lasso and palm rejection.',
      'The schema, the journal, the merge and the sync live in a core with no platform in it.',
      'One tokens.json defines colour, slots and motion for both clients.',
      'Local first. The desktop app is a behaviour-for-behaviour port of the iPad one.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-NOTES`,
    availability: 'Public · in progress',
    demonstration: {
      kind: 'ink',
    },
  },
];
