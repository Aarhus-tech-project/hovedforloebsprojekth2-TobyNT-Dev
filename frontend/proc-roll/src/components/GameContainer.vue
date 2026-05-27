<script setup>
import { ref, onMounted } from 'vue';
import render3D from '../threejs-game/main-scene-loader.js';
import LevelTransition from './LevelTransition.vue';

const target = ref(null);

function StartLevel() {
  render3D(target.value);
}

onMounted(() => {
  render3D(target.value);
});

</script>

<template>
  <LevelTransition></LevelTransition>
  <div ref="target"></div>
</template>