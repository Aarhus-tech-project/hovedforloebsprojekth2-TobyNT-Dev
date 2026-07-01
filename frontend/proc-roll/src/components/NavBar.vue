<script setup>
import { gameState } from '../threejs-game/game-states';

defineProps({
    isLoggedIn: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['toggle-login', 'toggle-shop', 'logout'])

let userCoins;

async function getBalance() {
    if (sessionStorage.getItem("token") != null && sessionStorage.getItem("token") != "test") {
        let userId = sessionStorage.getItem("token");
        let endpoint = `http://localhost:5263/api/User/${userId}`;

        const response = await fetch(endpoint)
        const text = await response.text()
        userCoins = JSON.parse(text).balance
    } else if (sessionStorage.getItem("token") == "test") {
        userCoins = sessionStorage.getItem("balance");
    } 
    
    else {
        console.error("User not found");
    }
}

getBalance();
</script>

<template>
    <nav v-if="gameState == 3" class="navbar" >
        <h1><span class="primary">void_</span></h1>

        <h2 class="primary">user_balance = {{ userCoins }}</h2>

        <div class="nav-right-side">
            <button @click="emit('toggle-shop')">openShop()</button>
            <button v-if="isLoggedIn" @click="emit('logout')" class="logout-btn">logOut()</button>
            <button v-else @click="emit('toggle-login')" class="login-btn">logIn()</button>
        </div>
    </nav>
</template>