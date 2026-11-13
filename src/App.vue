<script setup lang="ts">
import { onMounted, ref } from 'vue';

import FooterSection from '@/components/Footer/Footer-Section.vue';
import HeroSection from '@/components/Hero/Hero-Section.vue';
import LoadingCurtain from '@/components/Loader/Loading-Curtain.vue';
import ManifestoSection from '@/components/Manifesto/Manifesto-Section.vue';
import SiteNavigator from '@/components/Misc/Site-Navigator.vue';
import ProductsSection from '@/components/Products/Products-Section.vue';
import SystemSection from '@/components/System/System-Section.vue';
import { startScrollEngine } from '@/modules/scrollEngine';

const wrapper = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

onMounted(() => {
  if (wrapper.value && content.value) startScrollEngine(wrapper.value, content.value);
});
</script>

<template>
  <LoadingCurtain />
  <SiteNavigator />
  <div ref="wrapper" class="scroll-wrapper">
    <div ref="content" class="scroll-content">
      <main>
        <HeroSection />
        <ManifestoSection />
        <ProductsSection />
        <SystemSection />
      </main>
      <FooterSection />
    </div>
  </div>
</template>
