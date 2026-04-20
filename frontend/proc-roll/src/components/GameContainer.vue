<script setup>
import { ref, onMounted } from 'vue';
import render3D from '../threejs-game/main-scene-loader';

const target = ref(null);

onMounted(() => {
  render3D(target.value);
});

</script>

<template>
  <div ref="target"></div>
</template>