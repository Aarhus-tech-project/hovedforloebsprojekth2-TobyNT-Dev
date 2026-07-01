<script setup>
import { materialOpacity } from 'three/src/nodes/accessors/MaterialNode.js';
import { currentLevel, gameState, newGame } from '../threejs-game/game-states.js';
import StartLevel from './GameContainer.vue'

let loggedIn = false;

if (sessionStorage.getItem('token') != null) {
    loggedIn = true;
}
function getHighscore() {
    return parseInt(sessionStorage.getItem("highscore"), 10)
}
function getBalance() {
    return parseInt(sessionStorage.getItem("balance"), 10)
}
</script>

<template>
    <transition name="fade">
        <div v-if="gameState !== 1" class="fullscreen-cover">

            <!-- Game Over -->
            <div v-if="gameState === 0">
                <h2>user<span class="blink secondary">Failed</span>OnLevel({{ currentLevel }}) {</h2>
                <h2><blockquote>user_highscore = {{ getHighscore() }};</blockquote></h2>
                <h2><blockquote>user_balance = {{ getBalance() }};</blockquote></h2>
                <h2>};</h2>
                <button class="nextButton" @click="newGame">returnToMenu();</button>
            </div>

            <!-- Level Complete -->
            <div v-else-if="gameState === 2">
                <h2>level<span class="primary">Completed</span>({{ currentLevel - 1 }}) {</h2>
                <h2><blockquote>user_highscore = {{ getHighscore() }};</blockquote></h2>
                <h2><blockquote>user_balance = {{ getBalance() }};</blockquote></h2>
                <h2>};</h2>
                <button class="nextButton" @click="StartLevel; gameState = 1">goNextLevel();</button>
            </div>

            <!-- Start Screen -->
            <div v-else-if="gameState === 3">
                <h2><span class="secondary">$</span> welcome to the <span class="primary">void_</span></h2>
                <button v-if="loggedIn" class="nextButton" @click="StartLevel; gameState = 1">startGame()</button>
                <h2 v-else ><span class="secondary">$ </span>login_or_register_to_play</h2>
            </div>
        </div>
        <div v-else class="score-counter-box">
            <h3 class="score-counter primary">level_{{ currentLevel }}</h3>
        </div>
    </transition>
</template>