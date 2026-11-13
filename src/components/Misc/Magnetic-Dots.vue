<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { isReducedMotion } from '@/modules/scrollEngine';

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  scale: number;
  alpha: number;
}

const DOT_SIZE_PIXELS = 3;
const GAP_REM = 2;
const DRAG_RADIUS_REM = 6;
const SCALE_RADIUS_REM = 2;
const BRIGHTNESS_RADIUS_REM = 9;
const MAX_SCALE = 1.1;
const MIN_ALPHA = 0.15;
const MAX_ALPHA = 0.9;
const PRESS_PULL_BOOST = 2.2;
const STIFFNESS = 0.12;
const DAMPING = 0.82;
const SCALE_LERP = 0.18;
const ALPHA_LERP = 0.2;
const FADE_OUT_SPEED = 0.14;
const FADE_IN_SPEED = 0.05;
const FIELD_STRENGTH = 0.55;
const FALLBACK_COLOR = '#5bfd5b';
const OFFSCREEN = -10000;
const ADDRESS_BAR_ALLOWANCE = 160;

const canvas = ref<HTMLCanvasElement | null>(null);

let context: CanvasRenderingContext2D | null = null;
let dots: Dot[] = [];
let frameHandle = 0;
let resizeHandle = 0;
let width = 0;
let height = 0;
let pixelsPerRem = 16;
let pointerX = OFFSCREEN;
let pointerY = OFFSCREEN;
let isPressed = false;
let currentColor = FALLBACK_COLOR;
let targetColor = FALLBACK_COLOR;
let fieldAlpha = 1;
let fade: 'none' | 'out' | 'in' = 'none';

function buildGrid(): void {
  const element = canvas.value;
  if (!element) return;
  context = element.getContext('2d');
  if (!context) return;
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  pixelsPerRem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  element.width = width * ratio;
  element.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const gap = GAP_REM * pixelsPerRem;
  const columns = Math.ceil(width / gap) + 1;
  const rows = Math.ceil(height / gap) + 1;
  const offsetX = (width - (columns - 1) * gap) / 2;
  const offsetY = (height - (rows - 1) * gap) / 2;
  dots = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const homeX = offsetX + column * gap;
      const homeY = offsetY + row * gap;
      dots.push({ homeX, homeY, x: 0, y: 0, velocityX: 0, velocityY: 0, scale: 1, alpha: MIN_ALPHA });
    }
  }
}

function readColor(): void {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--section-color').trim();
  const next = value || FALLBACK_COLOR;
  if (next === targetColor) return;
  targetColor = next;
  fade = 'out';
}

function renderFrame(): void {
  if (!context) return;
  readColor();
  if (fade === 'out') {
    fieldAlpha = Math.max(0, fieldAlpha - FADE_OUT_SPEED);
    if (fieldAlpha <= 0.02) {
      currentColor = targetColor;
      fade = 'in';
    }
  } else if (fade === 'in') {
    fieldAlpha = Math.min(1, fieldAlpha + FADE_IN_SPEED);
    if (fieldAlpha >= 1) fade = 'none';
  }
  const dragRadius = DRAG_RADIUS_REM * pixelsPerRem;
  const scaleRadius = SCALE_RADIUS_REM * pixelsPerRem;
  const brightnessRadius = BRIGHTNESS_RADIUS_REM * pixelsPerRem;
  const boost = isPressed ? PRESS_PULL_BOOST : 1;
  context.clearRect(0, 0, width, height);
  context.fillStyle = currentColor;
  for (const dot of dots) {
    const deltaX = pointerX - dot.homeX;
    const deltaY = pointerY - dot.homeY;
    const distance = Math.hypot(deltaX, deltaY);
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let targetAlpha = MIN_ALPHA;
    if (distance < dragRadius) {
      const strength = (1 - distance / dragRadius) * boost;
      targetX = deltaX * strength;
      targetY = deltaY * strength;
    }
    if (distance < scaleRadius) targetScale = 1 + (MAX_SCALE - 1) * (1 - distance / scaleRadius);
    if (distance < brightnessRadius) {
      targetAlpha = MIN_ALPHA + (MAX_ALPHA - MIN_ALPHA) * (1 - distance / brightnessRadius);
    }
    dot.velocityX += (targetX - dot.x) * STIFFNESS;
    dot.velocityX *= DAMPING;
    dot.x += dot.velocityX;
    dot.velocityY += (targetY - dot.y) * STIFFNESS;
    dot.velocityY *= DAMPING;
    dot.y += dot.velocityY;
    dot.scale += (targetScale - dot.scale) * SCALE_LERP;
    dot.alpha += (targetAlpha - dot.alpha) * ALPHA_LERP;
    context.globalAlpha = dot.alpha * fieldAlpha * FIELD_STRENGTH;
    const size = DOT_SIZE_PIXELS * dot.scale;
    context.fillRect(dot.homeX + dot.x - size / 2, dot.homeY + dot.y - size / 2, size, size);
  }
  context.globalAlpha = 1;
}

function loop(): void {
  frameHandle = requestAnimationFrame(loop);
  renderFrame();
}

function handlePointerMove(event: PointerEvent): void {
  if (event.pointerType !== 'mouse') return;
  pointerX = event.clientX;
  pointerY = event.clientY;
}

function releasePointer(): void {
  pointerX = OFFSCREEN;
  pointerY = OFFSCREEN;
  isPressed = false;
}

function handlePress(event: PointerEvent): void {
  if (event.pointerType === 'mouse') isPressed = true;
}

function handleRelease(): void {
  isPressed = false;
}

function handleResize(): void {
  const isHeightOnly = window.innerWidth === width && Math.abs(window.innerHeight - height) < ADDRESS_BAR_ALLOWANCE;
  if (resizeHandle || isHeightOnly) return;
  resizeHandle = requestAnimationFrame(() => {
    resizeHandle = 0;
    buildGrid();
  });
}

onMounted(() => {
  buildGrid();
  readColor();
  currentColor = targetColor;
  fade = 'none';
  if (isReducedMotion()) {
    renderFrame();
    window.addEventListener('resize', handleResize);
    return;
  }
  frameHandle = requestAnimationFrame(loop);
  window.addEventListener('resize', handleResize);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerdown', handlePress);
  window.addEventListener('pointerup', handleRelease);
  window.addEventListener('blur', releasePointer);
  document.documentElement.addEventListener('mouseleave', releasePointer);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frameHandle);
  cancelAnimationFrame(resizeHandle);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('pointermove', handlePointerMove);
  window.removeEventListener('pointerdown', handlePress);
  window.removeEventListener('pointerup', handleRelease);
  window.removeEventListener('blur', releasePointer);
  document.documentElement.removeEventListener('mouseleave', releasePointer);
});
</script>

<template>
  <div class="magnetic-dots" aria-hidden="true">
    <canvas ref="canvas" class="magnetic-dots-canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.magnetic-dots {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.magnetic-dots-canvas {
  width: 100%;
  height: 100%;
}
</style>
