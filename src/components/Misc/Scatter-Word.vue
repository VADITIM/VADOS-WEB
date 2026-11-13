<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isReducedMotion, registerScrollSetup } from '@/modules/scrollEngine';

const props = defineProps<{ word: string }>();

const STAGGER_SPREAD = 1.4;
const SMALLEST_SCALE = 0.22;
const PIN_OFFSET = 'top top+=64';

const bar = ref<HTMLElement | null>(null);
const letters = computed(() => [...props.word]);

let letterElements: HTMLElement[] = [];
let travel = 0;

function measure(): void {
  const element = bar.value;
  const run = element?.querySelector<HTMLElement>('.scatter-run');
  if (!element || !run) return;
  travel = element.clientWidth - run.offsetWidth;
}

function applyProgress(progress: number): void {
  const lastIndex = letterElements.length - 1;
  letterElements.forEach((letter, letterIndex) => {
    const lead = (lastIndex - letterIndex) / lastIndex;
    const local = gsap.utils.clamp(0, 1, progress * (1 + STAGGER_SPREAD) - lead * STAGGER_SPREAD);
    const eased = gsap.parseEase('power2.inOut')(local);
    const shrink = Math.sin(Math.PI * local);
    gsap.set(letter, { x: travel * eased, scale: 1 - (1 - SMALLEST_SCALE) * shrink });
  });
}

onMounted(() => {
  if (!bar.value || isReducedMotion()) return;
  letterElements = [...bar.value.querySelectorAll<HTMLElement>('.scatter-letter')];
  registerScrollSetup(() => {
    ScrollTrigger.create({
      trigger: bar.value?.parentElement,
      start: PIN_OFFSET,
      end: 'bottom bottom',
      pin: bar.value,
      pinSpacing: false,
      onRefresh: (trigger) => {
        measure();
        applyProgress(trigger.progress);
      },
      onUpdate: (trigger) => applyProgress(trigger.progress),
    });
  });
});
</script>

<template>
  <div ref="bar" class="scatter-bar" aria-hidden="true">
    <span class="scatter-run">
      <span v-for="(letter, letterIndex) in letters" :key="letterIndex" class="scatter-letter">{{ letter }}</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.scatter-bar {
  position: absolute;
  top: 0;
  left: $gutter;
  right: $gutter;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: difference;
}

.scatter-run {
  display: inline-flex;
}

.scatter-letter {
  display: inline-block;
  font-family: $face-heading;
  font-size: clamp(1rem, 1.5vw, 1.6rem);
  line-height: 1.1;
  color: $text-bright;
  transform-origin: center center;
  will-change: transform;
}
</style>
