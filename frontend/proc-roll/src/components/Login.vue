<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-login', 'login-success', 'close'])

const isRegister = ref(false)

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
            ? 'http://localhost:5263/api/User'
            : 'http://localhost:5263/api/User/login'

        const body = isRegister.value
            ? {
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

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || 'Request failed')
        }

        const data = await response.json()

        if (!isRegister.value) {
            if (data.userId) {
                sessionStorage.setItem('token', data.userId)
                emit('login-success')
                window.location.reload();
            }
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
            
            <div class="alt-login-choices">
                <button class="login-cancel" type="button" @click="emit('close')">
                    Cancel
                </button>
    
                <button class="login-register" type="button" @click="toggleMode">
                    {{ isRegister ? 'Back to Login' : 'Register' }}
                </button>
            </div>
        </form>
    </div>
</template>