<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import { CUT_LEAVE_SECONDS } from '@/modules/motionConstants';
import { isReducedMotion } from '@/modules/scrollEngine';

const DROP_COUNT = 12;
const LEAD_SECONDS = 0.14;
const LAG_SECONDS = 0.055;
const LARGEST_REM = 6;
const SMALLEST_REM = 1.2;

type Mover = (value: number) => void;

const root = ref<HTMLElement | null>(null);
const drops = Array.from({ length: DROP_COUNT }, (_, dropIndex) => {
  const share = dropIndex / (DROP_COUNT - 1);
  return `${LARGEST_REM - (LARGEST_REM - SMALLEST_REM) * share}rem`;
});

let horizontalMovers: Mover[] = [];
let verticalMovers: Mover[] = [];
let dropElements: HTMLElement[] = [];
let surface: HTMLElement | null = null;
let isShown = false;

function followPointer(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || !surface) return;
  const rectangle = surface.getBoundingClientRect();
  const horizontal = event.clientX - rectangle.left;
  const vertical = event.clientY - rectangle.top;
  horizontalMovers.forEach((move) => move(horizontal));
  verticalMovers.forEach((move) => move(vertical));
  if (isShown) return;
  isShown = true;
  gsap.to(dropElements, { scale: 1, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.02, overwrite: 'auto' });
}

function releasePointer(): void {
  if (!isShown) return;
  isShown = false;
  gsap.to(dropElements, { scale: 0, duration: CUT_LEAVE_SECONDS, ease: 'power2.in', overwrite: 'auto' });
}

onMounted(() => {
  surface = root.value?.parentElement ?? null;
  if (!root.value || !surface || isReducedMotion()) return;
  dropElements = [...root.value.querySelectorAll<HTMLElement>('.trail-drop')];
  gsap.set(dropElements, { xPercent: -50, yPercent: -50, scale: 0 });
  dropElements.forEach((drop, dropIndex) => {
    const duration = LEAD_SECONDS + dropIndex * LAG_SECONDS;
    horizontalMovers.push(gsap.quickTo(drop, 'x', { duration, ease: 'power3.out' }));
    verticalMovers.push(gsap.quickTo(drop, 'y', { duration, ease: 'power3.out' }));
  });
  surface.addEventListener('pointermove', followPointer);
  surface.addEventListener('pointerleave', releasePointer);
});

onBeforeUnmount(() => {
  surface?.removeEventListener('pointermove', followPointer);
  surface?.removeEventListener('pointerleave', releasePointer);
  horizontalMovers = [];
  verticalMovers = [];
});
</script>

<template>
  <div ref="root" class="liquid-trail" aria-hidden="true">
    <svg class="trail-filter" width="0" height="0">
      <filter id="liquid-trail-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blurred" />
        <feColorMatrix in="blurred" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -11" />
      </filter>
    </svg>
    <div class="trail-drops">
      <span
        v-for="(size, dropIndex) in drops"
        :key="dropIndex"
        class="trail-drop"
        :style="{ width: size, height: size }"
      ></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.liquid-trail {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: difference;

  @media (hover: none), (pointer: coarse) {
    display: none;
  }
}

.trail-filter {
  position: absolute;
}

.trail-drops {
  position: absolute;
  inset: 0;
  filter: url('#liquid-trail-goo');
}

.trail-drop {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 999px;
  background: $accent;
  transform: scale(0);
}
</style>
