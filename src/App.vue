<template>
  <div id="app">
    <!-- Mostrar un loading mientras se verifica la autenticación -->
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
    
    <router-view v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore.js'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuthListener()
})
</script>