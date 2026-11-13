<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import LiftText from '@/components/Misc/Lift-Text.vue';
import SweepLabel from '@/components/Misc/Sweep-Label.vue';
import { accentStyle } from '@/modules/accentRoom';
import { useFullWidthText } from '@/modules/fitText';
import { SCRUB_SMOOTHING_SECONDS, TYPE_INTERVAL_MILLISECONDS } from '@/modules/motionConstants';
import { products } from '@/modules/productsRegistry';
import { isReducedMotion, onIntroFinished, registerScrollSetup, scrollToTarget } from '@/modules/scrollEngine';
import { useSectionReveal } from '@/modules/sectionReveal';
import { SYSTEM_VERSION } from '@/modules/systemRegistry';
import heroBanner from '@/modules/heroBanner.txt?raw';

import LiquidTrail from './Liquid-Trail.vue';

const HERO_ACCENT = '#5bfd5b';
const LINE_DRIFT_PERCENT = 18;
const SCROLL_DISTANCE_SHARE = 0.5;
const HEAD_LIFT_PERCENT = -40;
const bannerLines = heroBanner.replace(/\s+$/, '').split(/\r?\n/);
const bannerWidth = Math.max(...bannerLines.map((line) => line.length));
const TYPING_START_MILLISECONDS = 1500;
const typedLine = `${products.length} products / 1 system / version ${SYSTEM_VERSION}`;

const root = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);
const head = ref<HTMLElement | null>(null);
const typedLength = ref(0);

useSectionReveal(root, 'intro');
useFullWidthText(title);

function typeLine(): void {
  if (typedLength.value >= typedLine.length) return;
  typedLength.value += 1;
  window.setTimeout(typeLine, TYPE_INTERVAL_MILLISECONDS);
}

onMounted(() => {
  if (isReducedMotion()) {
    typedLength.value = typedLine.length;
    return;
  }
  onIntroFinished(() => window.setTimeout(typeLine, TYPING_START_MILLISECONDS));
  registerScrollSetup(() => {
    const scrollTrigger = {
      trigger: root.value,
      start: 'top top',
      end: () => `+=${(root.value?.offsetHeight ?? window.innerHeight) * SCROLL_DISTANCE_SHARE}`,
      scrub: SCRUB_SMOOTHING_SECONDS,
      invalidateOnRefresh: true,
    };
    const lines = title.value?.querySelectorAll<HTMLElement>('.hero-banner-line') ?? [];
    lines.forEach((line, lineIndex) => {
      const direction = lineIndex % 2 === 0 ? -1 : 1;
      const weight = (lineIndex + 1) / lines.length;
      gsap.to(line, { xPercent: direction * LINE_DRIFT_PERCENT * weight, opacity: 1 - weight, ease: 'none', scrollTrigger });
    });
    gsap.to(head.value, { yPercent: HEAD_LIFT_PERCENT, opacity: 0, ease: 'none', scrollTrigger });
  });
});
</script>

<template>
  <section id="top" ref="root" class="hero" :style="accentStyle(HERO_ACCENT)">
    <LiquidTrail />
    <div ref="head" class="hero-head">
      <SweepLabel class="micro-label" tag="p" text="V/AS — VAD/OS Application Systems" />
      <LiftText
        class="hero-statement"
        tag="p"
        text="Different Applications. A Single Experience."
      />
      <a class="sweep-control is-primary" href="#products" @click.prevent="scrollToTarget('#products')">
        See the products
        <span aria-hidden="true">→</span>
      </a>
    </div>
    <div class="hero-title-frame">
      <h1 class="hero-title">
        <span class="visually-hidden">VAD/OS</span>
        <span ref="title" class="hero-banner" aria-hidden="true">
          <span v-for="(line, lineIndex) in bannerLines" :key="lineIndex" class="hero-banner-line lift-mask">
            <span class="lift-piece" data-lift="display" :data-lift-order="lineIndex">{{
              line.padEnd(bannerWidth)
            }}</span>
          </span>
        </span>
      </h1>
    </div>
    <div class="hero-foot">
      <p class="hero-typed tabular" :aria-label="typedLine">
        <span aria-hidden="true">&gt; {{ typedLine.slice(0, typedLength) }}</span>
        <span class="hero-caret" aria-hidden="true"></span>
      </p>
      <SweepLabel class="micro-label" tag="p" text="Scroll ↓" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  min-height: 100vh;
  min-height: 100svh;
  padding: 5.5rem $gutter 2rem;
  overflow: hidden;
}

.hero-head {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: start;
  gap: 1.1rem;
}

.hero-statement {
  @include heading;
  max-width: 30ch;
  font-size: clamp(1rem, 1.45vw, 1.6rem);
  line-height: 1.3;
  color: $text-bright;

  @include verticalLayout {
    font-size: clamp(0.95rem, 4.4vw, 1.4rem);
  }
}

.hero-title-frame {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: grid;
  place-items: center;
  min-width: 0;
  padding-inline: $gutter;
  pointer-events: none;
}

.hero-title {
  width: min(100%, 90svh);
  margin: 0;
}

.hero-banner {
  display: inline-flex;
  flex-direction: column;
  font-family: $face-functional;
  font-size: 1vw;
  line-height: 1;
  color: $hero-banner;
  white-space: pre;
}

.hero-banner-line {
  display: block;
  padding-block: 0;
  margin-block: 0;
  will-change: transform, opacity;
}

.hero-foot {
  position: relative;
  z-index: 1;
  grid-row: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
}

.hero-typed {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  min-height: 1.5em;
  font-size: 0.8rem;
  color: $text-muted;
  white-space: pre;
}

.hero-caret {
  width: 0.6em;
  height: 1.15em;
  background: $accent;
  animation: caret-blink 1.06s steps(1, end) infinite;
}

@keyframes caret-blink {
  50% {
    opacity: 0;
  }
}

@include reducedMotion {
  .hero-caret {
    animation: none;
  }
}
</style>
