<script setup>
const emit = defineEmits(['toggle-login', 'toggle-shop'])
import { gameState} from '../threejs-game/game-states.js';
</script>

<template>
    <nav v-if="gameState == 3" class="navbar">
        <h1><span class="primary">void_</span></h1>

        <div class="nav-right-side">
            <button @click="emit('toggle-shop')">shop<span class="blink">_</span></button>
            <button @click="emit('toggle-login')">login<span class="blink">_</span></button>
        </div>
    </nav>
</template>