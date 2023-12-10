<template>
  <div :class="$style.chess">
    <div :class="$style.chess_inner"></div>
    <div :class="$style.chess_wrapper">
      <div :class="$style.chess_board"></div>
      <Chess
        v-for="item in chesses"
        :key="`${item.x}_${item.y}_${item.char}_${item.flag}`"
        :class="$style[`chess_point_${item.x}_${item.y}`]"
        :info="item"
      ></Chess>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Chess from './Chess.vue';

const props = defineProps({
  fin: {
    type: String,
    default: ''
  }
})

const chesses = computed(() => {
  let flag = true
  let index = 0
  const chesses = []

  for (const char of props.fin) {
    if (char === '+') {
      flag = true
      continue
    }
    
    if (char === '-') {
      flag = false
      continue
    }

    if (/^\d$/.test(char)) {
      index += +char
      continue
    }

    chesses.push({
      x: index % 5,
      y: Math.floor(index / 5),
      char,
      flag
    })

    index += 1
  }
  return chesses
})
</script>

<style lang="scss" module>
@import './vars.scss';

.chess {
  width: 100%;
  max-width: 375px;
  position: relative;

  &_inner {
    width: 100%;
    padding-top: $mapRatio;
    background-image: url("@/assets/images/chess_board.png");
    background-size: 100% 100%;
  }

  &_wrapper {
    top: 0;
    left: 0;
    width: 100%;
    padding-top: 100%;
    position: absolute;

    & > * {
      position: absolute;
    }
  }

  &_board {
    top: unit(60);
    left: unit(80);
    width: unit(600);
    height: unit(1010);
  }
}

@for $x from 0 through 4 {
  @for $y from 0 through 11 {
    $top: 60 + 75 * $y;

    @if $y > 5 {
      $top: $top + 260 - 75;
    }
    
    .chess_point_#{$x}_#{$y} {
      top: unit($top);
      left: unit(80 + 150 * $x);
      position: absolute;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
