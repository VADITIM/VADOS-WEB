<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LiftText from '@/components/Misc/Lift-Text.vue';
import SweepLabel from '@/components/Misc/Sweep-Label.vue';
import { accentStyle, useAccentRoom } from '@/modules/accentRoom';
import { useFullWidthText } from '@/modules/fitText';
import {
  SLICE_BAR_COUNT,
  SLICE_ENTER_SECONDS,
  SLICE_LEAVE_SECONDS,
  SLICE_STAGGER_SPREAD,
} from '@/modules/motionConstants';
import { isReducedMotion, registerScrollSetup, scrollToTarget } from '@/modules/scrollEngine';
import { useSectionReveal } from '@/modules/sectionReveal';
import { SYSTEM_VERSION } from '@/modules/systemRegistry';

const FOOTER_ACCENT = '#5bfd5b';
const PROFILE_URL = 'https://github.com/VADITIM';
const SLICE_REVEAL_SHARE = 0.95;

const HIDDEN_EDGE = 100;

const root = ref<HTMLElement | null>(null);
const frame = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);
const inkTitle = ref<HTMLElement | null>(null);
const inkLayer = ref<HTMLElement | null>(null);
const slice = ref<HTMLElement | null>(null);

const columns = Array.from({ length: SLICE_BAR_COUNT }, () => ({ top: HIDDEN_EDGE, bottom: HIDDEN_EDGE }));

useSectionReveal(root);
useAccentRoom(root, FOOTER_ACCENT);
useFullWidthText(title);
useFullWidthText(inkTitle);

let sliceTimeline: gsap.core.Timeline | null = null;

function columnShape(shift: number): string {
  const width = slice.value?.offsetWidth ?? 0;
  const step = width / columns.length;
  const upper = columns.flatMap((column, index) => [
    `${index * step - shift}px ${column.top}%`,
    `${(index + 1) * step - shift}px ${column.top}%`,
  ]);
  const lower = columns
    .map((column, index) => [`${(index + 1) * step - shift}px ${column.bottom}%`, `${index * step - shift}px ${column.bottom}%`])
    .reverse()
    .flat();
  return `polygon(${[...upper, ...lower].join(', ')})`;
}

function applySlice(): void {
  if (!slice.value || !inkLayer.value || !frame.value) return;
  const shift = frame.value.getBoundingClientRect().left - slice.value.getBoundingClientRect().left;
  slice.value.style.clipPath = columnShape(0);
  inkLayer.value.style.clipPath = columnShape(shift);
}

function playSlice(isEntering: boolean): void {
  sliceTimeline?.kill();
  sliceTimeline = gsap.timeline({
    onUpdate: applySlice,
    onComplete: () => {
      if (isEntering) return;
      columns.forEach((column) => Object.assign(column, { top: HIDDEN_EDGE, bottom: HIDDEN_EDGE }));
      applySlice();
    },
  });
  columns.forEach((column) => {
    sliceTimeline?.to(
      column,
      {
        top: 0,
        bottom: isEntering ? HIDDEN_EDGE : 0,
        duration: isEntering ? SLICE_ENTER_SECONDS : SLICE_LEAVE_SECONDS,
        ease: isEntering ? 'power3.out' : 'power3.in',
      },
      gsap.utils.random(0, SLICE_STAGGER_SPREAD),
    );
  });
}

onMounted(() => {
  if (isReducedMotion()) {
    columns.forEach((column) => Object.assign(column, { top: 0, bottom: HIDDEN_EDGE }));
    applySlice();
    return;
  }
  applySlice();
  registerScrollSetup(() => {
    ScrollTrigger.create({
      trigger: root.value,
      start: () => `top bottom-=${(root.value?.offsetHeight ?? 0) * SLICE_REVEAL_SHARE}`,
      invalidateOnRefresh: true,
      onRefresh: applySlice,
      onEnter: () => playSlice(true),
      onLeaveBack: () => playSlice(false),
    });
  });
});
</script>

<template>
  <footer ref="root" class="site-footer" :style="accentStyle(FOOTER_ACCENT)">
    <div class="footer-head">
      <LiftText class="footer-statement" tag="p" text="Start from the system." />
      <div class="footer-actions">
        <a class="sweep-control is-primary reveal-panel" :href="PROFILE_URL" target="_blank" rel="noopener">
          Open GitHub
          <span aria-hidden="true">↗</span>
        </a>
        <a class="sweep-control reveal-panel" href="#top" @click.prevent="scrollToTarget('#top')">
          Back to top
          <span aria-hidden="true">↑</span>
        </a>
      </div>
    </div>
    <div ref="frame" class="footer-title-frame">
      <span ref="slice" class="footer-slice" aria-hidden="true"></span>
      <p ref="title" class="footer-title" aria-hidden="true">
        <span class="lift-mask" v-for="(letter, letterIndex) in [...'VAD/OS']" :key="letterIndex">
          <span class="lift-piece" data-lift="display" :data-lift-order="letterIndex">{{ letter }}</span>
        </span>
      </p>
      <div ref="inkLayer" class="footer-title-ink" aria-hidden="true">
        <p ref="inkTitle" class="footer-title is-ink">
          <span class="lift-mask" v-for="(letter, letterIndex) in [...'VAD/OS']" :key="letterIndex">
            <span class="lift-piece" data-lift="display" :data-lift-order="letterIndex">{{ letter }}</span>
          </span>
        </p>
      </div>
    </div>
    <div class="footer-base">
      <SweepLabel class="micro-label tabular" tag="p" text="© 2026 VADITIM" />
      <SweepLabel class="micro-label tabular" tag="p" :text="`Built on V/AS ${SYSTEM_VERSION}`" />
      <SweepLabel class="micro-label" tag="p" text="Vue · GSAP · SCSS" />
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: clamp(3rem, 8vw, 8rem);
  min-height: 100vh;
  min-height: 100svh;
  padding: 9rem $gutter 1.5rem;
  border-top: 1px solid $border;
  overflow: hidden;

  @include verticalLayout {
    gap: 3rem;
    padding-top: 6rem;
  }
}

.footer-head {
  align-self: end;
  display: grid;
  justify-items: start;
  gap: 2rem;

  @include verticalLayout {
    align-self: center;
    justify-items: stretch;
    gap: 2.5rem;
  }
}

.footer-statement {
  @include heading;
  font-size: clamp(2rem, 5.6vw, 6.5rem);
  color: $text-bright;

  @include verticalLayout {
    font-size: clamp(2.6rem, 13vw, 5.5rem);
    line-height: 1.05;
  }
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @include verticalLayout {
    > * {
      flex: 1 1 0;
      justify-content: center;
    }
  }
}

.footer-title-frame {
  position: relative;
  isolation: isolate;
  min-width: 0;
}

.footer-slice {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(-1 * #{$gutter});
  z-index: -1;
  width: 100vw;
  background: $accent;
  pointer-events: none;
}

.footer-title-ink {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.footer-title {
  position: relative;
  display: inline-block;
  font-family: $face-display;
  font-size: 12vw;
  line-height: 1.1;
  color: $text-bright;
  white-space: nowrap;

  &.is-ink {
    color: $accent-ink;
  }
}

.footer-base {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
}
</style>
