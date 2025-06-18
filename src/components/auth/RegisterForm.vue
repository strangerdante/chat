<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
    ></div>
    
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/80 via-primary-600/85 to-primary-700/90"></div>
    
    <!-- Content -->
    <div class="relative z-10 w-full max-w-md mx-auto">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p class="text-white/80 text-sm sm:text-base">Únete a Vue.js Chat</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div v-if="authStore.error" class="bg-red-500/20 backdrop-blur border border-red-300/30 text-red-100 px-4 py-3 rounded-lg">
            {{ authStore.error }}
          </div>

          <div>
            <label for="displayName" class="block text-sm font-medium text-white/90 mb-2">Nombre de Usuario</label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              required
              autocomplete="name"
              class="w-full px-3 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-white/90 mb-2">Correo Electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="w-full px-3 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-white/90 mb-2">Contraseña</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              autocomplete="new-password"
              class="w-full px-3 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
              placeholder="Ingresa tu contraseña (mín. 6 caracteres)"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-white/90 mb-2">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="w-full px-3 py-3 bg-white/20 backdrop-blur border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/60"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <div v-if="password && confirmPassword && password !== confirmPassword" class="text-red-200 text-sm bg-red-500/20 backdrop-blur border border-red-300/30 px-3 py-2 rounded-lg">
            Las contraseñas no coinciden
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full bg-white text-primary-600 py-3 px-4 rounded-lg font-semibold text-base hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </span>
            <span v-else>Crear Cuenta</span>
          </button>

          <div class="text-center">
            <p class="text-white/80">
              ¿Ya tienes una cuenta?
              <button
                type="button"
                @click="$emit('switch-mode')"
                class="text-white font-semibold hover:text-white/80 transition-colors underline underline-offset-2"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const emit = defineEmits(['switch-mode'])

const router = useRouter()
const authStore = useAuthStore()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const isFormValid = computed(() => {
  return displayName.value.trim() !== '' && 
         email.value.trim() !== '' && 
         password.value.length >= 6 && 
         password.value === confirmPassword.value
})

const handleRegister = async () => {
  // Prevenir múltiples envíos
  if (isLoading.value || !isFormValid.value) {
    return
  }

  try {
    isLoading.value = true
    authStore.clearError()
    
    const success = await authStore.register(
      email.value.trim(), 
      password.value, 
      displayName.value.trim()
    )
    
    if (success) {
      // Limpiar el formulario
      displayName.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      router.push('/chat')
    }
  } catch (error) {
    console.error('Error en registro:', error)
  } finally {
    isLoading.value = false
  }
}
</script>