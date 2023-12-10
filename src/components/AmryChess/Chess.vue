<template>
  <div
    :class="[$style.chess, {
      [$style.is_blue]: isBlue
    }]"
  >
    <div :class="[
      $style.chess_text,
      $style[`chess_text_${info.char}`]
    ]" v-if="info.flag"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

const isBlue = computed(() => /^[a-l]$/.test(props.info.char))
</script>

<style lang="scss" module>
@import './vars.scss';

.chess {
  width: unit(103);
  height: unit(60);
  background-image: url('@/assets/images/chess_bg.png');
  background-size: 200%;

  &.is_blue {
    background-position: 100% 0;
  }

  &_text {
    top: 50%;
    left: 0;
    width: 100%;
    height: calc(51 / 70 * 100%);
    position: absolute;
    transform: translateY(-50%);
    background-image: url('@/assets/images/chess_text.png');
    background-size: 300% 800%;
  }

  @each $c in $chars {
    $i: index($chars, $c) - 1;
    $x: $i % 3;
    $y: floor($i / 3);

    .chess_text_#{$c} {
      background-position-x: calc($x * 50%);
      background-position-y: calc($y * 100% / 7);
    }
  }
}
</style>
