<script setup lang="ts">
import { onMounted, ref } from 'vue';

import FooterSection from '@/components/Footer/Footer-Section.vue';
import HeroSection from '@/components/Hero/Hero-Section.vue';
import MagneticDots from '@/components/Misc/Magnetic-Dots.vue';
import SiteNavigator from '@/components/Misc/Site-Navigator.vue';
import ProductsSection from '@/components/Products/Products-Section.vue';
import SystemSection from '@/components/System/System-Section.vue';
import { finishIntro, refreshScrollPositions, startScrollEngine } from '@/modules/scrollEngine';

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (wrapper.value && content.value) startScrollEngine(wrapper.value, content.value);
  await document.fonts.ready;
  refreshScrollPositions();
  finishIntro();
});
</script>

<template>
  <MagneticDots />
  <div class="top-fade" aria-hidden="true"></div>
  <SiteNavigator />
  <div ref="wrapper" class="scroll-wrapper">
    <div ref="content" class="scroll-content">
      <main>
        <HeroSection />
        <ProductsSection />
        <SystemSection />
      </main>
      <FooterSection />
    </div>
  </div>
</template>

<style scoped lang="scss">
.top-fade {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 7rem;
  background: linear-gradient(to bottom, $ground-deep 12%, transparent);
  pointer-events: none;
}
</style>
