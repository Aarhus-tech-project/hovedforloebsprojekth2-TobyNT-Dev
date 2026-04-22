<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])

const isRegister = ref(false)

const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')

const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
    error.value = null

    if (isRegister.value && password.value !== passwordConfirm.value) {
        error.value = 'Passwords do not match'
        return
    }

    loading.value = true

    try {
        const endpoint = isRegister.value
            ? 'https://your-api.com/register'
            : 'https://your-api.com/login'

        const body = isRegister.value
            ? {
                email: email.value,
                username: username.value,
                password: password.value
            }
            : {
                username: username.value,
                password: password.value
            }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Request failed')
        }

        // optional: only store token on login
        if (!isRegister.value) {
            localStorage.setItem('token', data.token)
        }

        emit('close')

    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

const toggleMode = () => {
    error.value = null
    isRegister.value = !isRegister.value
}
</script>

<template>
    <div class="login-container">
        <form class="login-card" @submit.prevent="handleSubmit">
            <h2 class="login-title">
                {{ isRegister ? 'Register' : 'Log in' }}
            </h2>

            <!-- Email (only for register) -->
            <div v-if="isRegister" class="form-group">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-input" required />
            </div>

            <!-- Username -->
            <div class="form-group">
                <label class="form-label">Username</label>
                <input v-model="username" type="text" class="form-input" required />
            </div>

            <!-- Password -->
            <div class="form-group">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-input" required />
            </div>

            <!-- Confirm Password (only for register) -->
            <div v-if="isRegister" class="form-group">
                <label class="form-label">Confirm Password</label>
                <input v-model="passwordConfirm" type="password" class="form-input" required />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>

            <button class="login-button" :disabled="loading">{{ loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Log in') }}</button>

            <button class="login-cancel" type="button" @click="emit('close')">
                Cancel
            </button>

            <button class="login-register" type="button" @click="toggleMode">
                {{ isRegister ? 'Back to Login' : 'Register' }}
            </button>
        </form>
    </div>
</template>