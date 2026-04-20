<script setup>
import { ref, onMounted } from 'vue';
import render3D from '../threejs-game/main-scene-loader.js';
import TransitionNextLevel from './TransitionNextLevel.vue';

const target = ref(null);

onMounted(() => {
  render3D(target.value);
});

</script>

<template>
  <TransitionNextLevel></TransitionNextLevel>
  <div ref="target"></div>
</template>