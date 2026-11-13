<script setup lang="ts">
import { ref } from 'vue';
import { gsap } from 'gsap';

import { CUT_LEAVE_SECONDS, SWEEP_GROW_SECONDS } from '@/modules/motionConstants';
import { isReducedMotion } from '@/modules/scrollEngine';

const props = defineProps<{ images: string[]; productName: string }>();

const image = ref<HTMLImageElement | null>(null);
const chosenIndex = ref(0);
const shownIndex = ref(0);

let cutTimeline: gsap.core.Timeline | null = null;

function showImage(imageIndex: number): void {
  if (imageIndex === chosenIndex.value) return;
  chosenIndex.value = imageIndex;
  const element = image.value;
  if (!element || isReducedMotion()) {
    shownIndex.value = imageIndex;
    return;
  }
  cutTimeline?.kill();
  cutTimeline = gsap
    .timeline()
    .to(element, { clipPath: 'inset(0 0 0 100%)', duration: CUT_LEAVE_SECONDS, ease: 'power2.in' })
    .call(() => {
      shownIndex.value = imageIndex;
    })
    .set(element, { clipPath: 'inset(0 100% 0 0)' })
    .to(element, { clipPath: 'inset(0 0% 0 0)', duration: SWEEP_GROW_SECONDS, ease: 'power2.out' });
}
</script>

<template>
  <div class="screenshots">
    <div class="screenshot-frame">
      <img
        ref="image"
        class="screenshot"
        :src="props.images[shownIndex]"
        :alt="`VAD/OS ${productName}, screenshot ${shownIndex + 1} of ${images.length}`"
      />
    </div>
    <ul v-if="images.length > 1" class="screenshot-choices">
      <li v-for="(source, imageIndex) in images" :key="source">
        <button
          class="screenshot-choice"
          type="button"
          :class="{ 'is-chosen': imageIndex === chosenIndex }"
          :aria-pressed="imageIndex === chosenIndex"
          :aria-label="`Show screenshot ${imageIndex + 1}`"
          @click="showImage(imageIndex)"
        >
          <img :src="source" alt="" loading="lazy" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.screenshots {
  display: grid;
  gap: 0.75rem;
}

.screenshot-frame {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: inherit;
  background: $sunken-deep;
}

.screenshot {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center top;
}

.screenshot-choices {
  display: flex;
  gap: 0.5rem;
}

.screenshot-choice {
  display: block;
  width: 4.75rem;
  aspect-ratio: 16 / 10;
  padding: 0;
  overflow: hidden;
  border: 1px solid $border-control;
  border-radius: 0.35rem;
  background: $sunken-deep;
  cursor: pointer;
  transition:
    box-shadow $hover-out $ease-leave,
    transform $release $ease-release;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left top;
  }

  @include finePointer {
    &:hover {
      box-shadow: inset 0 0 0 1px $border-hover;
    }
  }

  &:active {
    transform: scale(0.94);
    transition: transform $press ease-out;
  }

  &:focus-visible {
    outline: 2px solid $accent;
    outline-offset: 2px;
  }

  &.is-chosen {
    box-shadow: inset 0 0 0 2px $accent;
    transition: box-shadow $release $ease-enter;
  }
}
</style>
