<script setup>
import { currentLevel, gameState, newGame } from '../threejs-game/game-states.js';
import StartLevel from './GameContainer.vue'

</script>

<template>
    <transition name="fade">
        <div v-if="gameState !== 1" class="fullscreen-cover">

            <!-- Game Over -->
            <div v-if="gameState === 0">
                <h2>you <span class="blink secondary">failed</span><br>you completed {{ currentLevel - 1 }} levels!</h2>
                <button class="nextButton" @click="newGame">return to menu</button>
            </div>

            <!-- Level Complete -->
            <div v-else-if="gameState === 2">
                <h2>Level {{ currentLevel - 1 }} Completed!</h2>
                <button class="nextButton" @click="StartLevel; gameState = 1">next level</button>
            </div>

            <!-- Start Screen -->
            <div v-else-if="gameState === 3">
                <h2><span class="secondary">$</span> welcome to the <span class="primary">void_</span></h2>
                <button class="nextButton" @click="StartLevel; gameState = 1">start game</button>
            </div>
        </div>
        <div v-else class="score-counter-box">
            <h3 class="score-counter primary">level {{ currentLevel }}</h3>
        </div>
    </transition>
</template>