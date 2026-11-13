<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const THINNEST_STROKE = 2;
const PRESSURE_GAIN = 5;

const canvas = ref<HTMLCanvasElement | null>(null);
const hasInk = ref(false);

let context: CanvasRenderingContext2D | null = null;
let observer: ResizeObserver | null = null;
let isDrawing = false;
let previousHorizontal = 0;
let previousVertical = 0;

function prepareSurface(): void {
  const element = canvas.value;
  if (!element) return;
  const ratio = window.devicePixelRatio || 1;
  element.width = element.clientWidth * ratio;
  element.height = element.clientHeight * ratio;
  context = element.getContext('2d');
  if (!context) return;
  context.scale(ratio, ratio);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = getComputedStyle(element).color;
  hasInk.value = false;
}

function startStroke(event: PointerEvent): void {
  canvas.value?.setPointerCapture(event.pointerId);
  isDrawing = true;
  previousHorizontal = event.offsetX;
  previousVertical = event.offsetY;
}

function continueStroke(event: PointerEvent): void {
  if (!isDrawing || !context) return;
  context.lineWidth = THINNEST_STROKE + event.pressure * PRESSURE_GAIN;
  context.beginPath();
  context.moveTo(previousHorizontal, previousVertical);
  context.lineTo(event.offsetX, event.offsetY);
  context.stroke();
  previousHorizontal = event.offsetX;
  previousVertical = event.offsetY;
  hasInk.value = true;
}

function endStroke(): void {
  isDrawing = false;
}

onMounted(() => {
  if (!canvas.value) return;
  observer = new ResizeObserver(prepareSurface);
  observer.observe(canvas.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="ink">
    <canvas
      ref="canvas"
      class="ink-surface"
      aria-label="Ink canvas. Draw with a pen, a finger or the mouse."
      @pointerdown="startStroke"
      @pointermove="continueStroke"
      @pointerup="endStroke"
      @pointercancel="endStroke"
    ></canvas>
    <p class="ink-hint micro-label" :class="{ 'is-gone': hasInk }" aria-hidden="true">Draw here</p>
    <button class="ink-clear sweep-control is-bare" type="button" :disabled="!hasInk" @click="prepareSurface">
      Clear
    </button>
  </div>
</template>

<style scoped lang="scss">
.ink {
  position: relative;
  background: $sunken-deep;
}

.ink-surface {
  width: 100%;
  aspect-ratio: 16 / 10;
  color: $accent;
  cursor: crosshair;
  touch-action: none;
}

.ink-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: clip-path $hover-in $ease-enter;
  clip-path: inset(0 0 0 0);

  &.is-gone {
    clip-path: inset(0 100% 0 0);
    transition: clip-path $hover-out $ease-leave;
  }
}

.ink-clear {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;

  &:disabled {
    color: $text-icon;
    cursor: default;
    pointer-events: none;
  }
}
</style>
