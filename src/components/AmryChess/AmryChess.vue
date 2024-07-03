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
      <template v-if="animate">
        <div :class="[
          $style.chess_border,
          $style[`chess_point_${animate.start[0]}_${animate.start[1]}`]]"
        />
        <div :class="[
          $style.chess_border,
          $style[`chess_point_${animate.end[0]}_${animate.end[1]}`]]"
        />
        <Chess
          :class="[
            $style[`chess_point_${animate.chess.x}_${animate.chess.y}`],
          ]"
          :info="animate.chess"
          :style="`transition: ${animate.transition}`"
          @inited="animate.onInit"
          @transitionend="animate.callback"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import Chess from './Chess.vue';
import { parseChar } from './helper'

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
      ...parseChar(char, flag)
    })

    index += 1
  }
  return chesses
})

const animate = ref(null)
const playAnimate = async (char, startPoint, ...endPoints) => {
  if (animate.value) {
    animate.value = null
    await nextTick()
  }

  const chess = parseChar(char)
  const createAnimate = async (start, end, ends) => {
    await new Promise((resolve) => {
      let index = 0

      const getTransition = () => {
        const duration = 0.618 / ends.length
        const func = (() => {
          if (ends.length === 1) {
            return 'ease-in-out'
          }
          if (index === 0) {
            return 'ease-in'
          }
          if (index === ends.length - 1) {
            return 'ease-out'
          }
          return 'linear'
        })()
        return `all ${duration}s ${func}`
      }
      
      const change = (node) => {
        if (index < ends.length) {
          setTimeout(() => {
            node.chess.x = ends[index][0]
            node.chess.y = ends[index][1]
            index += 1
            node.transition = getTransition()
          }, 0)
        } else {
          resolve()
        }
      }

      animate.value = {
        chess: {
          x: start[0],
          y: start[1],
          ...chess,
        },
        end,
        start,
        transition: getTransition(),
        onInit: () => change(animate.value),
        callback: () => change(animate.value)
      }
    })
  }

  await createAnimate(startPoint, endPoints[endPoints.length - 1], endPoints)
}

defineExpose({
  playAnimate
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

  &_border {
    width: unit(103);
    height: unit(60);
    border: 2px solid red;
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
