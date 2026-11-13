<script setup lang="ts">
import { computed } from 'vue';

type LiftUnit = 'character' | 'word' | 'block';

interface LiftWord {
  pieces: string[];
  firstOrder: number;
}

const props = withDefaults(defineProps<{ text: string; tag?: string; unit?: LiftUnit; isDisplay?: boolean }>(), {
  tag: 'span',
  unit: 'word',
  isDisplay: false,
});

const liftKind = computed(() => (props.isDisplay ? 'display' : 'text'));

const words = computed<LiftWord[]>(() => {
  let order = 0;
  return props.text.split(' ').map((word) => {
    const pieces = props.unit === 'character' ? [...word] : [word];
    const firstOrder = order;
    order += pieces.length;
    return { pieces, firstOrder };
  });
});
</script>

<template>
  <component :is="tag" class="lift-text">
    <span class="visually-hidden">{{ text }}</span>
    <span v-if="unit === 'block'" class="lift-mask lift-block" aria-hidden="true">
      <span class="lift-piece lift-block-piece" :data-lift="liftKind">{{ text }}</span>
    </span>
    <span v-else aria-hidden="true">
      <template v-for="(word, wordIndex) in words" :key="wordIndex">
        <span class="lift-word">
          <span v-for="(piece, pieceIndex) in word.pieces" :key="pieceIndex" class="lift-mask">
            <span class="lift-piece" :data-lift="liftKind" :data-lift-order="word.firstOrder + pieceIndex">{{
              piece
            }}</span>
          </span>
        </span>
        {{ ' ' }}
      </template>
    </span>
  </component>
</template>

<style scoped lang="scss">
.lift-block {
  display: block;
}

.lift-block-piece {
  display: block;
  white-space: normal;
}
</style>
