<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import { isReducedMotion } from '@/modules/scrollEngine';

const TILE_COUNT = 6;
const COLUMN_COUNT = 3;
const GRID_STEP_PERCENT = 108;
const STACK_STEP_PERCENT = 4;
const STACK_TILT_DEGREES = 4;
const OPEN_SECONDS = 0.5;
const CLOSE_SECONDS = 0.25;
const OPEN_STAGGER_SECONDS = 0.04;

const root = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const tiles = Array.from({ length: TILE_COUNT }, (_, tileIndex) => `${28 + tileIndex * 14}%`);

let tileElements: HTMLElement[] = [];

function stackedPose(tileIndex: number): gsap.TweenVars {
  return {
    xPercent: -50 + tileIndex * STACK_STEP_PERCENT,
    yPercent: -50 - tileIndex * STACK_STEP_PERCENT,
    rotation: (tileIndex - (TILE_COUNT - 1) / 2) * STACK_TILT_DEGREES,
  };
}

function gridPose(tileIndex: number): gsap.TweenVars {
  const column = (tileIndex % COLUMN_COUNT) - 1;
  const row = Math.floor(tileIndex / COLUMN_COUNT) - 0.5;
  return { xPercent: -50 + column * GRID_STEP_PERCENT, yPercent: -50 + row * GRID_STEP_PERCENT, rotation: 0 };
}

function toggleStack(): void {
  isOpen.value = !isOpen.value;
  tileElements.forEach((tile, tileIndex) => {
    const pose = isOpen.value ? gridPose(tileIndex) : stackedPose(tileIndex);
    if (isReducedMotion()) {
      gsap.set(tile, pose);
      return;
    }
    gsap.to(tile, {
      ...pose,
      duration: isOpen.value ? OPEN_SECONDS : CLOSE_SECONDS,
      ease: isOpen.value ? 'back.out(1.5)' : 'power2.in',
      delay: isOpen.value ? tileIndex * OPEN_STAGGER_SECONDS : 0,
      overwrite: 'auto',
    });
  });
}

onMounted(() => {
  if (!root.value) return;
  tileElements = [...root.value.querySelectorAll<HTMLElement>('.stack-tile')];
  tileElements.forEach((tile, tileIndex) => gsap.set(tile, stackedPose(tileIndex)));
});
</script>

<template>
  <button
    ref="root"
    class="stack"
    type="button"
    :aria-pressed="isOpen"
    :aria-label="isOpen ? 'Fold the album into a stack' : 'Open the stack into a grid'"
    @click="toggleStack"
  >
    <span
      v-for="(share, tileIndex) in tiles"
      :key="tileIndex"
      class="stack-tile"
      :style="{ '--tile-share': share }"
    ></span>
  </button>
</template>

<style scoped lang="scss">
.stack {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  padding: 0;
  border: 0;
  background: $sunken-deep;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }
}

.stack-tile {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 25%;
  aspect-ratio: 1;
  border: 1px solid $ground;
  border-radius: 0.5rem;
  background: color-mix(in srgb, $accent var(--tile-share), $panel-solid);
  transform: translate(-50%, -50%);
}
</style>
