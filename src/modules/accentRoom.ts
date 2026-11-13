import { onMounted, toValue, type MaybeRefOrGetter, type Ref } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { registerScrollSetup } from './scrollEngine';

const DARK_INK = '#181818';
const LIGHT_INK = '#ffffff';
const LIGHT_THRESHOLD = 0.5;

export function isLightColor(hex: string): boolean {
  const red = parseInt(hex.slice(1, 3), 16) / 255;
  const green = parseInt(hex.slice(3, 5), 16) / 255;
  const blue = parseInt(hex.slice(5, 7), 16) / 255;
  return red * 0.299 + green * 0.587 + blue * 0.114 > LIGHT_THRESHOLD;
}

export function inkFor(accent: string): string {
  return isLightColor(accent) ? DARK_INK : LIGHT_INK;
}

export function accentStyle(accent: string): Record<string, string> {
  return { '--section-color': accent, '--accent-ink': inkFor(accent) };
}

export function setStandingAccent(accent: string): void {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--section-color', accent);
  rootStyle.setProperty('--accent-ink', inkFor(accent));
}

export function useAccentRoom(
  root: Ref<HTMLElement | null>,
  accent: MaybeRefOrGetter<string>,
  onActive?: () => void,
): void {
  onMounted(() => {
    const element = root.value;
    if (!element) return;
    registerScrollSetup(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (trigger) => {
          if (!trigger.isActive) return;
          setStandingAccent(toValue(accent));
          onActive?.();
        },
      });
    });
  });
}
