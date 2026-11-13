export type ProductDemonstration =
  | { kind: 'screenshots'; images: string[]; label: string; caption: string }
  | { kind: 'recording'; video: string; label: string; caption: string }
  | { kind: 'liquid'; label: string; caption: string }
  | { kind: 'stack'; label: string; caption: string }
  | { kind: 'ink'; label: string; caption: string }
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
    headline: 'A desktop environment that grows out of one screen edge.',
    strengths: [
      'Taskbar, search, dashboard and settings are one liquid system, not separate widgets.',
      'Built for driftwm first. Runs on Hyprland and any wlroots compositor.',
      'Window modes: a free infinite canvas, or a desktop with snap, maximize and minimize.',
      'One shell.json holds the whole configuration and applies live.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-SHELL`,
    availability: 'Public',
    demonstration: {
      kind: 'liquid',
      label: 'Live · the taskbar edge',
      caption: 'Move the pointer to pull liquid out of the bar. Click to open the search column.',
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    platform: 'Windows · Linux',
    stack: 'Tauri v2 · SvelteKit · Rust',
    accent: '#8a2be2',
    headline: 'Every command becomes a block you can read, fold and search.',
    strengths: [
      'Output is structured information: hierarchy, results and errors, not one stream of text.',
      'Raw, structured and rendered views of the same command. Nothing is lost or replaced.',
      'It interprets output only when it is sure, and falls back to the raw terminal when it is not.',
      'SSH, tmux and full-screen programs run unchanged.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-TERMINAL`,
    availability: 'Public',
    demonstration: {
      kind: 'screenshots',
      images: ['media/terminal-3.png', 'media/terminal-1.png', 'media/terminal-4.png', 'media/terminal-5.png'],
      label: 'Screenshots · Windows build',
      caption: 'git diff printed as a block: the warning, the usage line and the options each have their own level.',
    },
  },
  {
    id: 'bubble',
    name: 'Bubble',
    platform: 'Galaxy S25 · One UI 8',
    stack: 'Kotlin · WebView · Shizuku',
    accent: '#FFDD1B',
    headline: 'The status bar, the shade and the Now Bar, replaced by one bubble.',
    strengths: [
      'Music, a running timer and a call share the camera cutout and split off as circles.',
      'A notification grows out of the bubble in the colour of its app, then folds back.',
      'Tap the status bubble and it opens into quick settings, weather, storage and memory.',
      'No root. Privileged actions run through a Shizuku user service.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-BUBBLE`,
    availability: 'Public',
    demonstration: {
      kind: 'recording',
      video: 'media/bubble-latest.mp4',
      label: 'Recorded on the S25',
      caption: 'Fifteen seconds of the bubble carrying music, alerts and the dashboard.',
    },
  },
  {
    id: 'gallery',
    name: 'Gallery',
    platform: 'Android · Arch',
    stack: 'Kotlin · Jetpack Compose · Qt 6',
    accent: '#DC143C',
    headline: 'A gallery with three sections and a menu that holds three things.',
    strengths: [
      'Recent, Albums and Favorites. Newest at the bottom, where the thumb already is.',
      'Every gesture drives its change frame by frame. Letting go only decides.',
      'An album folds into a stack and opens into a grid under the finger.',
      'The same gallery runs as a native Qt 6 app on Arch.',
    ],
    repositoryUrl: `${GITHUB}/VADOS-GALLERY`,
    availability: 'Public',
    demonstration: {
      kind: 'stack',
      label: 'Live · the stack group',
      caption: 'Press the stack. It opens into a grid, and closes faster than it opened.',
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
      label: 'Screenshot · list view',
      caption: 'Home in list view with the details column open.',
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
      label: 'Live · the ink canvas',
      caption: 'Draw here with a pen, a finger or the mouse.',
    },
  },
  {
    id: 'dashboard',
    name: 'VAD/OS',
    platform: 'Web',
    stack: 'A web interface over an Obsidian vault',
    accent: '#2ee6ff',
    headline: 'An agentic OS dashboard for Claude.',
    strengths: [
      'The web interface over the Obsidian memory vault that the agents read and write.',
      'The product the name VAD/OS means when it stands alone.',
    ],
    repositoryUrl: null,
    availability: 'Private',
    demonstration: { kind: 'none' },
  },
];
