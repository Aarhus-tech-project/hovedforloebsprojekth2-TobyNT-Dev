<script setup>
import { ref, onMounted } from 'vue'
import GameContainer from './components/GameContainer.vue'
import Login from './components/Login.vue'
import NavBar from './components/NavBar.vue'
import Shop from './components/Shop.vue'

const showLogin = ref(false)
const showShop = ref(false)
const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = !!sessionStorage.getItem('token')
})

const handleLoginSuccess = () => {
  isLoggedIn.value = true
  showLogin.value = false
}

const handleLogout = () => {
  sessionStorage.removeItem('token')
  isLoggedIn.value = false
  window.location.reload();
}
</script>

<template>
  <div id="main-container">
    <NavBar :isLoggedIn="isLoggedIn" @toggle-login="showLogin = !showLogin" @toggle-shop="showShop = !showShop" @logout="handleLogout"/>    

    <Login v-if="showLogin" @close="showLogin = false" @login-success="handleLoginSuccess"/>
    <Shop v-if="showShop" @close="showShop = false"/>
    
    <GameContainer />
  </div>
</template>
