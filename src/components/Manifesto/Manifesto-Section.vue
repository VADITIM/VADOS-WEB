<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { accentStyle } from '@/modules/accentRoom';
import { SCRUB_SMOOTHING_SECONDS } from '@/modules/motionConstants';
import { products } from '@/modules/productsRegistry';
import { isReducedMotion, registerScrollSetup } from '@/modules/scrollEngine';

const MANIFESTO_ACCENT = '#5bfd5b';
const PIN_DISTANCE = '+=110%';
const DOCK_END = 0.4;
const WORDS_START = 0.25;
const WORDS_END = 0.8;
const DOCKED_SCALE = 0.3;
const ENTRY_TILT_DEGREES = 6;
const ENTRY_DROP_PERCENT = 12;
const leadingWords = `One design system. ${products.length} products. Every hover, press and drag is`.split(' ');
const slabWords = ['answered', 'with', 'motion.'];
const statement = [...leadingWords, ...slabWords].join(' ');

const root = ref<HTMLElement | null>(null);
const card = ref<HTMLElement | null>(null);
const slab = ref<HTMLElement | null>(null);
const litCount = ref(0);
const isSlabFull = ref(false);
const isStill = ref(false);

function share(progress: number, start: number, end: number): number {
  return gsap.utils.clamp(0, 1, (progress - start) / (end - start));
}

function applyProgress(progress: number): void {
  const dockShare = gsap.parseEase('power2.inOut')(share(progress, 0, DOCK_END));
  gsap.set(card.value, {
    scale: 1 - (1 - DOCKED_SCALE) * dockShare,
    rotationX: ENTRY_TILT_DEGREES * (1 - dockShare),
    yPercent: ENTRY_DROP_PERCENT * (1 - dockShare),
    transformPerspective: 1200,
  });
  litCount.value = Math.ceil(share(progress, WORDS_START, WORDS_END) * leadingWords.length);
  const slabShare = share(progress, WORDS_END, 1);
  gsap.set(slab.value, { scaleX: slabShare });
  isSlabFull.value = slabShare > 0.5;
}

onMounted(() => {
  if (isReducedMotion()) {
    isStill.value = true;
    litCount.value = leadingWords.length;
    isSlabFull.value = true;
    gsap.set(slab.value, { scaleX: 1 });
    return;
  }
  applyProgress(0);
  registerScrollSetup(() => {
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: PIN_DISTANCE,
      pin: true,
      scrub: SCRUB_SMOOTHING_SECONDS,
      anticipatePin: 1,
      onUpdate: (trigger) => applyProgress(trigger.progress),
    });
  });
});
</script>

<template>
  <section ref="root" class="manifesto" :class="{ 'is-still': isStill }" :style="accentStyle(MANIFESTO_ACCENT)">
    <figure ref="card" class="manifesto-card">
      <img src="/media/files-preview.png" alt="VAD/OS Files showing the home folder in list view" />
      <figcaption class="micro-label">VAD/OS Files · list view</figcaption>
    </figure>
    <div class="manifesto-copy">
      <p class="micro-label">( The premise )</p>
      <p class="manifesto-statement">
        <span class="visually-hidden">{{ statement }}</span>
        <span aria-hidden="true">
          <template v-for="(word, wordIndex) in leadingWords" :key="wordIndex">
            <span class="manifesto-word" :class="{ 'is-lit': wordIndex < litCount }">{{ word }}</span>
            {{ ' ' }}
          </template>
          <span class="manifesto-phrase" :class="{ 'is-covered': isSlabFull }">
            <span ref="slab" class="manifesto-slab"></span>
            <template v-for="word in slabWords" :key="word">
              <span class="manifesto-word">{{ word }}</span>
              {{ ' ' }}
            </template>
          </span>
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.manifesto {
  position: relative;
  height: 100vh;
  padding: 5.5rem $gutter 3rem;
  overflow: hidden;

  &.is-still {
    height: auto;
    min-height: 100vh;
  }
}

.manifesto-card {
  position: absolute;
  top: 5.5rem;
  right: $gutter;
  z-index: 2;
  width: calc(100% - #{$gutter} * 2);
  transform-origin: right top;
  will-change: transform;

  img {
    width: 100%;
    border: 1px solid $border;
    border-radius: $squircle;
  }

  figcaption {
    margin-top: 0.8rem;
    font-size: 1.4rem;
    letter-spacing: 0.3rem;
    text-align: right;
  }

  .is-still & {
    position: relative;
    top: auto;
    right: auto;
    width: min(100%, 40rem);
    margin: 0 0 3rem auto;

    figcaption {
      font-size: $label-size;
      letter-spacing: $label-tracking;
    }
  }
}

.manifesto-copy {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1.5rem;
  height: 100%;
  max-width: 64%;

  @include verticalLayout {
    max-width: none;
  }
}

.manifesto-statement {
  @include heading;
  max-width: 17ch;
  font-size: clamp(2rem, 4.4vw, 5.5rem);

  @include verticalLayout {
    font-size: clamp(1.7rem, 8.6vw, 4rem);
  }
}

.manifesto-word {
  display: inline-block;
  color: $text-faint;
  transition: color $hover-out $ease-leave;

  &.is-lit {
    color: $text-bright;
    transition: color $hover-in $ease-enter;
  }
}

.manifesto-phrase {
  position: relative;
  isolation: isolate;
  display: inline-block;
  padding: 0 0.18em;
  margin: 0 -0.18em;

  &.is-covered .manifesto-word {
    color: $accent-ink;
  }
}

.manifesto-slab {
  position: absolute;
  inset: -0.04em 0;
  z-index: -1;
  background: $accent;
  transform: scaleX(0);
  transform-origin: left center;
}
</style>
