<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { isReducedMotion } from '@/modules/scrollEngine';

defineProps<{ video: string; productName: string }>();

const VISIBLE_SHARE = 0.4;

const player = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isHeldByViewer = ref(isReducedMotion());

let observer: IntersectionObserver | null = null;
let isInView = false;

function syncPlayback(): void {
  const element = player.value;
  if (!element) return;
  if (isInView && !isHeldByViewer.value) void element.play().catch(() => undefined);
  else element.pause();
}

function togglePlayback(): void {
  isHeldByViewer.value = !isHeldByViewer.value;
  syncPlayback();
}

onMounted(() => {
  if (!player.value) return;
  observer = new IntersectionObserver(
    ([entry]) => {
      isInView = entry.isIntersecting;
      syncPlayback();
    },
    { threshold: VISIBLE_SHARE },
  );
  observer.observe(player.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="recording">
    <video
      ref="player"
      class="recording-player"
      :src="video"
      :aria-label="`Screen recording of VAD/OS ${productName}`"
      muted
      loop
      playsinline
      preload="metadata"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    ></video>
    <button class="sweep-control is-bare" type="button" :aria-pressed="isPlaying" @click="togglePlayback">
      {{ isPlaying ? 'Pause' : 'Play' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.recording {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  background: $sunken-deep;
  padding: 0.75rem;
}

.recording-player {
  width: auto;
  max-width: 100%;
  height: min(68vh, 40rem);
  border-radius: 0.35rem;
}
</style>
