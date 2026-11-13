<script setup lang="ts">
import { ref } from 'vue';

import LiftText from '@/components/Misc/Lift-Text.vue';
import ScatterWord from '@/components/Misc/Scatter-Word.vue';
import SweepLabel from '@/components/Misc/Sweep-Label.vue';
import { products } from '@/modules/productsRegistry';
import { useSectionReveal } from '@/modules/sectionReveal';

import ProductRoom from './Product-Room.vue';

const COUNT_WIDTH = 2;

const header = ref<HTMLElement | null>(null);

const paddedTotal = String(products.length).padStart(COUNT_WIDTH, '0');

useSectionReveal(header);
</script>

<template>
  <section id="products" class="products">
    <header ref="header" class="products-header">
      <SweepLabel class="micro-label" tag="p" text="( Built on V/AS )" />
      <h2 class="products-title">
        <LiftText text="Products" unit="character" is-display />
        <span class="products-total tabular">
          (<span class="reveal-count" :data-count-to="products.length" :data-count-width="COUNT_WIDTH">{{
            paddedTotal
          }}</span
          >)
        </span>
      </h2>
      <LiftText
        class="products-statement"
        tag="p"
        text="Each one is a different platform and a different engine. All of them move the same way."
      />
    </header>
    <div class="products-body">
      <ScatterWord word="PRODUCTS" />
      <ProductRoom
        v-for="(product, productIndex) in products"
        :key="product.id"
        :product="product"
        :room-index="productIndex"
        :room-count="products.length"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.products-header {
  display: grid;
  gap: 1rem;
  padding: 9rem $gutter 4rem;
}

.products-title {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-family: $face-display;
  font-size: clamp(3rem, 10.5vw, 13rem);
  line-height: 1.1;
  color: $text-bright;
  text-transform: uppercase;

  @include verticalLayout {
    font-size: clamp(2.2rem, 11vw, 6rem);
  }
}

.products-total {
  @include microLabel;
  margin-top: 0.6em;
  font-size: 0.9rem;
  color: $accent;
}

.products-statement {
  @include heading;
  justify-self: end;
  max-width: 26ch;
  font-size: clamp(1.1rem, 2vw, 2.2rem);
  color: $text-bright;

  @include verticalLayout {
    justify-self: start;
  }
}

.products-body {
  position: relative;
}
</style>
