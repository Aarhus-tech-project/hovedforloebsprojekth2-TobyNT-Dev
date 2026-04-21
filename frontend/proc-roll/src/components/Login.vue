<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
    error.value = null
    loading.value = true

    try {
        const response = await fetch('https://your-api.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Login failed')
        }

        localStorage.setItem('token', data.token)

        console.log('Logged in:', data)

        // optional: close modal on success
        emit('close')

    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-container">
        <form class="login-card" @submit.prevent="handleLogin">
            <h2 class="login-title">Log in</h2>

            <div class="form-group">
                <label class="form-label">Username</label>
                <input v-model="username" type="text" class="form-input" placeholder="username" required />
            </div>

            <div class="form-group">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-input" placeholder="Enter your password"
                    required />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>
            <button class="login-button" :disabled="loading">{{ loading ? 'Logging in...' : 'Log in' }}</button>
            <button class="login-cancel" type="button" @click="emit('close')">Cancel</button>
        </form>
    </div>
</template>
