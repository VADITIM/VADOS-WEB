<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { gsap } from 'gsap';

import LiftText from '@/components/Misc/Lift-Text.vue';
import SweepLabel from '@/components/Misc/Sweep-Label.vue';
import { accentStyle, useAccentRoom } from '@/modules/accentRoom';
import type { Product } from '@/modules/productsRegistry';
import { isReducedMotion, registerScrollSetup } from '@/modules/scrollEngine';
import { useSectionReveal } from '@/modules/sectionReveal';

import ProductMedia from './Product-Media.vue';

const props = defineProps<{ product: Product; roomIndex: number; roomCount: number }>();

const COUNT_WIDTH = 2;
const SLICE_HIDDEN_PERCENT = 70;

const root = ref<HTMLElement | null>(null);
const slice = ref<HTMLElement | null>(null);

const isMirrored = computed(() => props.roomIndex % 2 === 1);
const hasDemonstration = computed(() => props.product.demonstration.kind !== 'none');
const roomLabel = computed(() => {
  const number = String(props.roomIndex + 1).padStart(COUNT_WIDTH, '0');
  const total = String(props.roomCount).padStart(COUNT_WIDTH, '0');
  return `${number} / ${total} — ${props.product.platform}`;
});

useSectionReveal(root);
useAccentRoom(root, () => props.product.accent);

onMounted(() => {
  if (isReducedMotion()) return;
  const hiddenPercent = isMirrored.value ? -SLICE_HIDDEN_PERCENT : SLICE_HIDDEN_PERCENT;
  gsap.set(slice.value, { xPercent: hiddenPercent });
  registerScrollSetup(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: root.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(slice.value, { xPercent: 0, ease: 'none' })
      .to(slice.value, { width: '100vw', ease: 'none' });
  });
});
</script>

<template>
  <article
    :id="`product-${product.id}`"
    ref="root"
    class="product-room"
    :class="{ 'is-mirrored': isMirrored, 'is-plain': !hasDemonstration }"
    :style="accentStyle(product.accent)"
  >
    <span ref="slice" class="room-slice" aria-hidden="true"></span>
    <div class="room-copy">
      <SweepLabel class="micro-label tabular" tag="p" :text="roomLabel" />
      <LiftText class="room-name" tag="h3" :text="product.name" unit="character" is-display />
      <LiftText class="room-headline" tag="p" :text="product.headline" />
      <ul class="room-strengths">
        <li v-for="strength in product.strengths" :key="strength" class="room-strength">
          <span class="strength-mark" aria-hidden="true"></span>
          <LiftText :text="strength" unit="block" />
        </li>
      </ul>
      <dl class="room-facts">
        <div class="room-fact">
          <dt class="micro-label">Stack</dt>
          <dd><LiftText :text="product.stack" unit="block" /></dd>
        </div>
        <div class="room-fact">
          <dt class="micro-label">Repository</dt>
          <dd><LiftText :text="product.availability" unit="block" /></dd>
        </div>
      </dl>
      <a
        v-if="product.repositoryUrl"
        class="sweep-control is-primary reveal-panel"
        :href="product.repositoryUrl"
        target="_blank"
        rel="noopener"
      >
        Open repository
        <span aria-hidden="true">↗</span>
      </a>
    </div>
    <ProductMedia v-if="hasDemonstration" class="room-media" :product="product" />
  </article>
</template>

<style scoped lang="scss">
.product-room {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 6rem);
  min-height: 100vh;
  padding: 8rem $gutter;
  overflow: hidden;

  &.is-mirrored {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);

    .room-copy {
      order: 2;
    }

    .room-slice {
      right: auto;
      left: 0;
      clip-path: polygon(0 0, 68% 0, 100% 100%, 0 100%);
    }
  }

  &.is-plain {
    grid-template-columns: minmax(0, 1fr);
    min-height: 70vh;
  }

  @include verticalLayout {
    grid-template-columns: minmax(0, 1fr);
    padding: 6rem $gutter;

    &.is-mirrored {
      grid-template-columns: minmax(0, 1fr);

      .room-copy {
        order: 0;
      }
    }
  }
}

.room-slice {
  position: absolute;
  top: 14%;
  bottom: 14%;
  right: 0;
  width: 26vw;
  background: $accent;
  clip-path: polygon(32% 0, 100% 0, 100% 100%, 0 100%);
  pointer-events: none;

  @include verticalLayout {
    top: auto;
    bottom: 4rem;
    width: 62vw;
    height: 42vw;
  }
}

.room-copy {
  position: relative;
  display: grid;
  justify-items: start;
  gap: 1.5rem;
}

.room-name {
  font-family: $face-display;
  font-size: clamp(2.6rem, 6.2vw, 7.5rem);
  line-height: 1.1;
  color: $text-bright;
  text-transform: uppercase;

  @include verticalLayout {
    font-size: clamp(2.2rem, 11.5vw, 5rem);
  }
}

.room-headline {
  @include heading;
  max-width: 24ch;
  font-size: clamp(1.05rem, 1.7vw, 1.9rem);
  line-height: 1.25;
  color: $text-bright;
}

.room-strengths {
  display: grid;
  gap: 0.7rem;
}

.room-strength {
  @include prose;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.9rem;
  max-width: 58ch;
  font-size: 0.85rem;
}

.strength-mark {
  width: 0.5rem;
  height: 0.5rem;
  margin-top: 0.5em;
  background: $accent;
}

.room-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 3rem;
  margin: 0;
}

.room-fact {
  display: grid;
  gap: 0.3rem;

  dd {
    margin: 0;
    font-size: 0.85rem;
    color: $text-bright;
  }
}

.room-media {
  position: relative;
}
</style>
