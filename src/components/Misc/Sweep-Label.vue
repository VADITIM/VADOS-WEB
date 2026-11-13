<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{ text: string; tag?: string; isSplitByWord?: boolean }>(), {
  tag: 'span',
  isSplitByWord: false,
});

const units = computed(() => (props.isSplitByWord ? props.text.split(' ') : [props.text]));
</script>

<template>
  <component :is="tag" class="pc-label" :class="{ 'pc-label-row': isSplitByWord }">
    <span v-if="isSplitByWord" class="visually-hidden">{{ text }}</span>
    <span
      v-for="(unit, unitIndex) in units"
      :key="unitIndex"
      class="pc-label-inner"
      :aria-hidden="isSplitByWord ? 'true' : undefined"
    >
      <span class="pc-label-text">{{ unit }}</span>
      <span class="pc-label-bar" aria-hidden="true"></span>
    </span>
  </component>
</template>
