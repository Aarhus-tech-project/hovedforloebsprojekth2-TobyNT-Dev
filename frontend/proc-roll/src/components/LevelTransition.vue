<script setup>
import { currentLevel, gameState } from '../threejs-game/game-states.js';
import StartLevel from './GameContainer.vue'

</script>

<template>
    <transition name="fade">
        <div v-if="gameState != 1" class="fullscreen-cover">
              <h2 v-if="gameState == 2">Level {{ currentLevel - 1 }} Completed!</h2>
              <button v-if="gameState == 2" v-on:click="StartLevel; gameState = 1" >Next Level</button>
              <h2 v-if="gameState == 0">You failed... <br> you completed {{currentLevel - 1}} levels!</h2>
              <h2 v-if="gameState == 3">Welcome to Proc Roll!</h2>
              <button v-if="gameState == 3" v-on:click="StartLevel; gameState = 1" >Start Game!</button>
        </div>
    </transition>
</template>