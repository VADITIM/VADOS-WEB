<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import { CUT_LEAVE_SECONDS } from '@/modules/motionConstants';
import { isReducedMotion } from '@/modules/scrollEngine';

const DROP_COUNT = 12;
const LARGEST_REM = 6;
const SMALLEST_REM = 1.2;
const LEAD_STIFFNESS = 0.3;
const CHAIN_STIFFNESS = 0.38;
const STIFFNESS_FALLOFF = 0.012;
const LEAD_DAMPING = 0.76;
const CHAIN_DAMPING = 0.42;
const STRETCH_PER_PIXEL = 0.009;
const LARGEST_STRETCH = 0.45;
const SQUASH_SHARE = 0.6;
const STRETCH_SMOOTHING = 0.2;
const ANGLE_SMOOTHING = 0.35;
const RESTING_SPEED = 0.4;
const FRAME_RATE = 60;
const LARGEST_STEP_COUNT = 4;

type Drop = {
  element: HTMLElement;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  stretch: number;
  angle: number;
  presence: number;
};

const root = ref<HTMLElement | null>(null);
const sizes = Array.from({ length: DROP_COUNT }, (_, dropIndex) => {
  const share = dropIndex / (DROP_COUNT - 1);
  return `${LARGEST_REM - (LARGEST_REM - SMALLEST_REM) * share}rem`;
});

let drops: Drop[] = [];
let surface: HTMLElement | null = null;
let pointerX = 0;
let pointerY = 0;
let isShown = false;
let isTicking = false;
let presenceTween: gsap.core.Tween | null = null;

function shortestQuarterTurn(from: number, to: number): number {
  const difference = ((to - from + 90) % 180 + 180) % 180 - 90;
  return from + difference;
}

function integrate(): void {
  drops.forEach((drop, dropIndex) => {
    const leader = dropIndex === 0 ? { x: pointerX, y: pointerY } : drops[dropIndex - 1];
    const stiffness = (dropIndex === 0 ? LEAD_STIFFNESS : CHAIN_STIFFNESS) - dropIndex * STIFFNESS_FALLOFF;
    const damping = dropIndex === 0 ? LEAD_DAMPING : CHAIN_DAMPING;
    drop.velocityX = (drop.velocityX + (leader.x - drop.x) * stiffness) * damping;
    drop.velocityY = (drop.velocityY + (leader.y - drop.y) * stiffness) * damping;
    drop.x += drop.velocityX;
    drop.y += drop.velocityY;
  });
}

function stepDrops(): void {
  const stepCount = Math.min(Math.max(Math.round(gsap.ticker.deltaRatio(FRAME_RATE)), 1), LARGEST_STEP_COUNT);
  for (let step = 0; step < stepCount; step += 1) integrate();
  drops.forEach((drop) => {
    const speed = Math.hypot(drop.velocityX, drop.velocityY);
    const targetStretch = Math.min(speed * STRETCH_PER_PIXEL, LARGEST_STRETCH);
    drop.stretch += (targetStretch - drop.stretch) * STRETCH_SMOOTHING;
    if (speed > RESTING_SPEED) {
      const heading = (Math.atan2(drop.velocityY, drop.velocityX) * 180) / Math.PI;
      const target = shortestQuarterTurn(drop.angle, heading);
      drop.angle = (drop.angle + (target - drop.angle) * ANGLE_SMOOTHING) % 360;
    }
    const scaleAlong = (1 + drop.stretch) * drop.presence;
    const scaleAcross = (1 / (1 + drop.stretch * SQUASH_SHARE)) * drop.presence;
    drop.element.style.transform =
      `translate(${drop.x}px, ${drop.y}px) translate(-50%, -50%) ` +
      `rotate(${drop.angle}deg) scale(${scaleAlong}, ${scaleAcross})`;
  });
}

function startTicking(): void {
  if (isTicking) return;
  isTicking = true;
  gsap.ticker.add(stepDrops);
}

function stopTicking(): void {
  if (!isTicking) return;
  isTicking = false;
  gsap.ticker.remove(stepDrops);
}

function placeAllAtPointer(): void {
  drops.forEach((drop) => Object.assign(drop, { x: pointerX, y: pointerY, velocityX: 0, velocityY: 0, stretch: 0 }));
}

function followPointer(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || !surface) return;
  const rectangle = surface.getBoundingClientRect();
  pointerX = event.clientX - rectangle.left;
  pointerY = event.clientY - rectangle.top;
  if (isShown) return;
  isShown = true;
  presenceTween?.kill();
  if (drops.every((drop) => drop.presence === 0)) placeAllAtPointer();
  startTicking();
  presenceTween = gsap.to(drops, {
    presence: 1,
    duration: 0.5,
    ease: 'back.out(1.6)',
    stagger: 0.02,
  });
}

function releasePointer(): void {
  if (!isShown) return;
  isShown = false;
  presenceTween?.kill();
  presenceTween = gsap.to(drops, {
    presence: 0,
    duration: CUT_LEAVE_SECONDS,
    ease: 'power2.in',
    onComplete: () => {
      stepDrops();
      stopTicking();
    },
  });
}

onMounted(() => {
  surface = root.value?.parentElement ?? null;
  if (!root.value || !surface || isReducedMotion()) return;
  drops = [...root.value.querySelectorAll<HTMLElement>('.trail-drop')].map((element) => ({
    element,
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    stretch: 0,
    angle: 0,
    presence: 0,
  }));
  surface.addEventListener('pointermove', followPointer);
  surface.addEventListener('pointerleave', releasePointer);
});

onBeforeUnmount(() => {
  surface?.removeEventListener('pointermove', followPointer);
  surface?.removeEventListener('pointerleave', releasePointer);
  presenceTween?.kill();
  stopTicking();
  drops = [];
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
        v-for="(size, dropIndex) in sizes"
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
  will-change: transform;
}
</style>
