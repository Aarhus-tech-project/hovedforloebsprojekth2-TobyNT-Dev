<script setup>
import { ref } from 'vue'
import GameContainer from './components/GameContainer.vue'
import Login from './components/Login.vue'

const showLoginForm = ref(false)
</script>

<template>
  <div id="main-container">
    
    
    <GameContainer />
    
    <h1>Proc Roll</h1>
    <button class="login-form-toggle" @click="showLoginForm = !showLoginForm">Log-in</button>
    <Login v-if="showLoginForm" @close="showLoginForm = false" />
  </div>
</template>