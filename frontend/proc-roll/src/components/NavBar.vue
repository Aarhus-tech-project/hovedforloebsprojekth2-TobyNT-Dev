<script setup>
const emit = defineEmits(['toggle-login', 'toggle-shop'])
</script>

<template>
    <nav class="navbar">
        <h1><span class="logo">void_</span></h1>

        <div class="nav-right-side">
            <button @click="emit('toggle-shop')">shop<span class="blink">_</span></button>
            <button @click="emit('toggle-login')">login<span class="blink">_</span></button>
        </div>
    </nav>
</template>