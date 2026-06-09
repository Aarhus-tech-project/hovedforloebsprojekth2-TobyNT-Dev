<script setup>
import { ref } from 'vue'
import GameContainer from './components/GameContainer.vue'
import Login from './components/Login.vue'
import NavBar from './components/NavBar.vue'
import Shop from './components/Shop.vue'

const showLogin = ref(false)
const showShop = ref(false)
</script>

<template>
  <div id="main-container">
    <NavBar @toggle-login="showLogin = !showLogin" @toggle-shop="showShop = !showShop"/>
    
    <Login v-if="showLogin" @close="showLogin = false"/>
    <Shop v-if="showShop" @close="showShop = false"/>
    
    <GameContainer />
  </div>
</template>