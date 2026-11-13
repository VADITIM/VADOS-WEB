<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import { isReducedMotion } from '@/modules/scrollEngine';

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 250;
const BAR_WIDTH = 46;
const COLUMN_WIDTH = 190;
const REST_HORIZONTAL = BAR_WIDTH / 2;
const REST_VERTICAL = VIEW_HEIGHT / 2;
const DROP_RADIUS = 26;
const PILL_POSITIONS = [40, 80, 120, 160, 210];
const OPEN_SECONDS = 0.6;
const CLOSE_SECONDS = 0.25;

type Mover = (value: number) => void;

const surface = ref<SVGSVGElement | null>(null);
const drop = ref<SVGCircleElement | null>(null);
const column = ref<SVGRectElement | null>(null);
const isColumnOpen = ref(false);

let moveHorizontally: Mover | null = null;
let moveVertically: Mover | null = null;

function followPointer(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || !surface.value) return;
  const rectangle = surface.value.getBoundingClientRect();
  const horizontal = ((event.clientX - rectangle.left) / rectangle.width) * VIEW_WIDTH;
  const vertical = ((event.clientY - rectangle.top) / rectangle.height) * VIEW_HEIGHT;
  moveHorizontally?.(horizontal - REST_HORIZONTAL);
  moveVertically?.(vertical - REST_VERTICAL);
}

function releasePointer(): void {
  moveHorizontally?.(0);
  moveVertically?.(0);
}

function toggleColumn(): void {
  isColumnOpen.value = !isColumnOpen.value;
  const width = isColumnOpen.value ? COLUMN_WIDTH : BAR_WIDTH;
  if (isReducedMotion()) {
    gsap.set(column.value, { attr: { width } });
    return;
  }
  gsap.to(column.value, {
    attr: { width },
    duration: isColumnOpen.value ? OPEN_SECONDS : CLOSE_SECONDS,
    ease: isColumnOpen.value ? 'back.out(1.7)' : 'power2.in',
    overwrite: 'auto',
  });
}

onMounted(() => {
  if (isReducedMotion()) return;
  moveHorizontally = gsap.quickTo(drop.value, 'x', { duration: 0.45, ease: 'power3.out' });
  moveVertically = gsap.quickTo(drop.value, 'y', { duration: 0.45, ease: 'power3.out' });
});
</script>

<template>
  <svg
    ref="surface"
    class="liquid"
    :viewBox="`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`"
    role="button"
    tabindex="0"
    :aria-pressed="isColumnOpen"
    aria-label="Toggle the search column"
    @pointermove="followPointer"
    @pointerleave="releasePointer"
    @click="toggleColumn"
    @keydown.enter.prevent="toggleColumn"
    @keydown.space.prevent="toggleColumn"
  >
    <defs>
      <filter id="shell-liquid-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blurred" />
        <feColorMatrix in="blurred" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" />
      </filter>
    </defs>
    <g class="liquid-body" filter="url(#shell-liquid-goo)">
      <rect x="0" y="0" :width="BAR_WIDTH" :height="VIEW_HEIGHT" />
      <rect ref="column" x="0" y="0" :width="BAR_WIDTH" :height="VIEW_HEIGHT" />
      <circle ref="drop" :cx="REST_HORIZONTAL" :cy="REST_VERTICAL" :r="DROP_RADIUS" />
    </g>
    <circle
      v-for="position in PILL_POSITIONS"
      :key="position"
      class="liquid-pill"
      :cx="REST_HORIZONTAL"
      :cy="position"
      r="7"
    />
  </svg>
</template>

<style scoped lang="scss">
.liquid {
  width: 100%;
  background: $sunken-deep;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }
}

.liquid-body {
  fill: $accent;
}

.liquid-pill {
  fill: $accent-ink;
  pointer-events: none;
}
</style>
