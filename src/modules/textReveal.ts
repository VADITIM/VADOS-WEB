import { gsap } from 'gsap';

import {
  COUNT_SECONDS,
  HORIZONTAL_STAGGER_WEIGHT,
  LIFT_DISPLAY_SECONDS,
  LIFT_TEXT_SECONDS,
  PANEL_ENTER_SECONDS,
  SWEEP_GROW_SECONDS,
  SWEEP_RETRACT_SECONDS,
  VERTICAL_STAGGER_WEIGHT,
} from './motionConstants';
import { isReducedMotion } from './scrollEngine';

const LABEL_SELECTOR = '.pc-label-inner';
const LIFT_SELECTOR = '.lift-piece';
const PANEL_SELECTOR = '.reveal-panel';
const COUNT_SELECTOR = '.reveal-count';
const CLIPPED_TEXT = 'inset(0 100% 0 0)';
const OPEN_TEXT = 'inset(0 0% 0 0)';
const CLIPPED_PANEL = 'inset(0 0 100% 0)';
const OPEN_PANEL = 'inset(0 0 0% 0)';
const HIDDEN_LIFT_PERCENT = 115;

function collect(root: HTMLElement, selector: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(selector)];
}

function positionalDelay(element: HTMLElement, frame: DOMRect, startAt: number): number {
  const rectangle = element.getBoundingClientRect();
  const verticalFraction = gsap.utils.clamp(0, 1, (rectangle.top - frame.top) / frame.height);
  const horizontalFraction = gsap.utils.clamp(0, 1, (rectangle.left - frame.left) / frame.width);
  return startAt + verticalFraction * VERTICAL_STAGGER_WEIGHT + horizontalFraction * HORIZONTAL_STAGGER_WEIGHT;
}

function formatCount(element: HTMLElement, value: number): string {
  const width = Number(element.dataset.countWidth ?? '1');
  return String(Math.round(value)).padStart(width, '0');
}

export function buildLabelReveal(label: HTMLElement): gsap.core.Timeline {
  const timeline = gsap.timeline();
  const text = label.querySelector('.pc-label-text');
  const bar = label.querySelector('.pc-label-bar');
  if (!text || !bar) return timeline;
  gsap.killTweensOf([text, bar]);
  gsap.set(text, { clipPath: CLIPPED_TEXT });
  gsap.set(bar, { scaleX: 0, opacity: 1, transformOrigin: 'left center' });
  timeline
    .to(bar, { scaleX: 1, duration: SWEEP_GROW_SECONDS, ease: 'power3.inOut' })
    .set(text, { clipPath: OPEN_TEXT })
    .set(bar, { transformOrigin: 'right center' })
    .to(bar, { scaleX: 0, duration: SWEEP_RETRACT_SECONDS, ease: 'power3.inOut' })
    .set(bar, { opacity: 0 });
  return timeline;
}

export function hideRevealPieces(root: HTMLElement): void {
  if (isReducedMotion()) return;
  collect(root, LABEL_SELECTOR).forEach((label) => {
    gsap.set(label.querySelector('.pc-label-text'), { clipPath: CLIPPED_TEXT });
    gsap.set(label.querySelector('.pc-label-bar'), { scaleX: 0, opacity: 1, transformOrigin: 'left center' });
  });
  gsap.set(collect(root, LIFT_SELECTOR), { yPercent: HIDDEN_LIFT_PERCENT });
  gsap.set(collect(root, PANEL_SELECTOR), { clipPath: CLIPPED_PANEL });
  collect(root, COUNT_SELECTOR).forEach((element) => {
    element.textContent = formatCount(element, 0);
  });
}

export function playRevealPieces(root: HTMLElement, startAt: number): void {
  if (isReducedMotion()) return;
  const frame = root.getBoundingClientRect();
  collect(root, LABEL_SELECTOR).forEach((label) => {
    buildLabelReveal(label).delay(positionalDelay(label, frame, startAt));
  });
  collect(root, LIFT_SELECTOR).forEach((piece) => {
    const isDisplay = piece.dataset.lift === 'display';
    const order = Number(piece.dataset.liftOrder ?? '0');
    gsap.to(piece, {
      yPercent: 0,
      duration: isDisplay ? LIFT_DISPLAY_SECONDS : LIFT_TEXT_SECONDS,
      ease: isDisplay ? 'back.out(1.4)' : 'power2.out',
      delay: positionalDelay(piece, frame, startAt) + order * 0.035,
      overwrite: 'auto',
    });
  });
  collect(root, PANEL_SELECTOR).forEach((panel) => {
    gsap.to(panel, {
      clipPath: OPEN_PANEL,
      duration: PANEL_ENTER_SECONDS,
      ease: 'power2.out',
      delay: positionalDelay(panel, frame, startAt),
      overwrite: 'auto',
      clearProps: 'clipPath',
    });
  });
  collect(root, COUNT_SELECTOR).forEach((element) => {
    const counter = { value: 0 };
    gsap.to(counter, {
      value: Number(element.dataset.countTo ?? '0'),
      duration: COUNT_SECONDS,
      ease: 'power2.out',
      delay: positionalDelay(element, frame, startAt),
      onUpdate: () => {
        element.textContent = formatCount(element, counter.value);
      },
    });
  });
}
