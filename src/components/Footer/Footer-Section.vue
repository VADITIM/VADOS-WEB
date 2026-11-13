<script setup lang="ts">
import { ref } from 'vue';

import LiftText from '@/components/Misc/Lift-Text.vue';
import SweepLabel from '@/components/Misc/Sweep-Label.vue';
import { accentStyle, useAccentRoom } from '@/modules/accentRoom';
import { useFullWidthText } from '@/modules/fitText';
import { scrollToTarget } from '@/modules/scrollEngine';
import { useSectionReveal } from '@/modules/sectionReveal';
import { SYSTEM_VERSION } from '@/modules/systemRegistry';

const FOOTER_ACCENT = '#5bfd5b';
const PROFILE_URL = 'https://github.com/VADITIM';

const root = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);

useSectionReveal(root);
useAccentRoom(root, FOOTER_ACCENT);
useFullWidthText(title);
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
    <div class="footer-title-frame">
      <p ref="title" class="footer-title" aria-hidden="true">
        <span class="lift-mask" v-for="(letter, letterIndex) in [...'VAD/OS']" :key="letterIndex">
          <span class="lift-piece" data-lift="display" :data-lift-order="letterIndex">{{ letter }}</span>
        </span>
      </p>
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
  gap: clamp(3rem, 8vw, 8rem);
  padding: 9rem $gutter 1.5rem;
  border-top: 1px solid $border;
  overflow: hidden;
}

.footer-head {
  display: grid;
  justify-items: start;
  gap: 2rem;
}

.footer-statement {
  @include heading;
  font-size: clamp(2rem, 5.6vw, 6.5rem);
  color: $text-bright;
}

.footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-title-frame {
  min-width: 0;
}

.footer-title {
  display: inline-block;
  font-family: $face-display;
  font-size: 12vw;
  line-height: 1.1;
  color: $text-bright;
  white-space: nowrap;
}

.footer-base {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
}
</style>
