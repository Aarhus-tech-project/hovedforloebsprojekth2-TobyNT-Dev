<script setup>
import { currentLevel, gameState } from '../threejs-game/game-states.js';

</script>

<template>
    <transition name="fade">
        <div v-if="gameState != 1" class="fullscreen-cover">
              <h2 v-if="gameState == 2">Level {{ currentLevel }} Completed!</h2>
              <h2 v-if="gameState == 0">You Failed! <br> you completed {{currentLevel - 1}} levels!</h2>
        </div>
    </transition>
</template>