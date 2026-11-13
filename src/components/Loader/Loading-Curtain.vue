<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import {
  CURTAIN_BAR_COUNT,
  CURTAIN_CLOSE_SECONDS,
  CURTAIN_OPEN_SECONDS,
  CURTAIN_STAGGER_SPREAD,
  LOADING_COUNT_SECONDS,
} from '@/modules/motionConstants';
import { finishIntro, isReducedMotion, refreshScrollPositions } from '@/modules/scrollEngine';

const FULL_COUNT = 100;

const root = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const count = ref(0);
const isGone = ref(false);

const paddedCount = computed(() => String(Math.round(count.value)).padStart(3, '0'));

function randomStagger(): number {
  return gsap.utils.random(0, CURTAIN_STAGGER_SPREAD);
}

function playCurtain(): void {
  const element = root.value;
  if (!element) return;
  const bars = [...element.querySelectorAll<HTMLElement>('.curtain-bar')];
  const closeEnd = CURTAIN_CLOSE_SECONDS + CURTAIN_STAGGER_SPREAD;
  const timeline = gsap.timeline({
    onComplete: () => {
      isGone.value = true;
    },
  });
  bars.forEach((bar) => {
    timeline.to(bar, { scaleY: 1, duration: CURTAIN_CLOSE_SECONDS, ease: 'power3.inOut' }, randomStagger());
  });
  timeline
    .set(stage.value, { autoAlpha: 0 }, closeEnd)
    .set(element, { backgroundColor: 'transparent' }, closeEnd)
    .set(bars, { transformOrigin: 'center top' }, closeEnd)
    .call(finishIntro, undefined, closeEnd);
  bars.forEach((bar) => {
    timeline.to(
      bar,
      { scaleY: 0, duration: CURTAIN_OPEN_SECONDS, ease: 'power3.inOut' },
      closeEnd + randomStagger(),
    );
  });
}

onMounted(async () => {
  if (isReducedMotion()) {
    count.value = FULL_COUNT;
    await document.fonts.ready;
    refreshScrollPositions();
    isGone.value = true;
    finishIntro();
    return;
  }
  const counting = gsap.to(count, { value: FULL_COUNT, duration: LOADING_COUNT_SECONDS, ease: 'power2.inOut' });
  await Promise.all([counting.then(), document.fonts.ready]);
  refreshScrollPositions();
  playCurtain();
});
</script>

<template>
  <div v-show="!isGone" ref="root" class="loading-curtain" role="status" aria-label="Loading">
    <div ref="stage" class="loading-stage" aria-hidden="true">
      <span class="loading-mark">V/AS</span>
      <span class="loading-count tabular">{{ paddedCount }}</span>
    </div>
    <div class="curtain-bars" aria-hidden="true">
      <span v-for="barIndex in CURTAIN_BAR_COUNT" :key="barIndex" class="curtain-bar"></span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-curtain {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: $ground;
}

.loading-stage {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.loading-mark {
  font-family: $face-display;
  font-size: clamp(3rem, 9vw, 8rem);
  line-height: 1.1;
  color: $text-bright;
}

.loading-count {
  @include microLabel;
  color: $accent;
}

.curtain-bars {
  position: absolute;
  inset: 0;
  display: flex;
}

.curtain-bar {
  flex: 1;
  margin-inline: -0.5px;
  background: $accent;
  transform: scaleY(0);
  transform-origin: center bottom;
}
</style>
