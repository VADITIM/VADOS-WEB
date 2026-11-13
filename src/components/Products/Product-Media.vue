<script setup lang="ts">
import Module from '@/components/Misc/Module.vue';
import type { Product } from '@/modules/productsRegistry';

import InkDemonstration from './Demonstrations/Ink-Demonstration.vue';
import LiquidDemonstration from './Demonstrations/Liquid-Demonstration.vue';
import RecordingDemonstration from './Demonstrations/Recording-Demonstration.vue';
import ScreenshotDemonstration from './Demonstrations/Screenshot-Demonstration.vue';
import StackDemonstration from './Demonstrations/Stack-Demonstration.vue';

defineProps<{ product: Product }>();
</script>

<template>
  <Module
    v-if="product.demonstration.kind !== 'none'"
    :label="product.demonstration.label"
    :caption="product.demonstration.caption"
  >
    <ScreenshotDemonstration
      v-if="product.demonstration.kind === 'screenshots'"
      :images="product.demonstration.images"
      :product-name="product.name"
    />
    <RecordingDemonstration
      v-else-if="product.demonstration.kind === 'recording'"
      :video="product.demonstration.video"
      :product-name="product.name"
    />
    <LiquidDemonstration v-else-if="product.demonstration.kind === 'liquid'" />
    <StackDemonstration v-else-if="product.demonstration.kind === 'stack'" />
    <InkDemonstration v-else-if="product.demonstration.kind === 'ink'" />
  </Module>
</template>
