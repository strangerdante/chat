<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ authStore.error }}
    </div>

    <div>
      <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
      <input
        id="displayName"
        v-model="displayName"
        type="text"
        required
        autocomplete="name"
        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Ingresa tu nombre de usuario"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Ingresa tu correo electrónico"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        minlength="6"
        autocomplete="new-password"
        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Ingresa tu contraseña (mín. 6 caracteres)"
      />
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        required
        autocomplete="new-password"
        class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        placeholder="Confirma tu contraseña"
      />
    </div>

    <div v-if="password && confirmPassword && password !== confirmPassword" class="text-red-600 text-sm">
      Las contraseñas no coinciden
    </div>

    <button
      type="submit"
      :disabled="isLoading || !isFormValid"
      class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isLoading" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Creando cuenta...
      </span>
      <span v-else>Crear Cuenta</span>
    </button>

    <div class="text-center">
      <p class="text-gray-600">
        ¿Ya tienes una cuenta?
        <button
          type="button"
          @click="$emit('switch-mode')"
          class="text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          Inicia sesión aquí
        </button>
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore.js'

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