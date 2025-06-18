<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()

onMounted(async () => {
  // Inicializar el listener de autenticación
  authStore.initializeAuthListener()
  
  // Dar un momento para que se procese el estado inicial
  setTimeout(() => {
    authStore.loading = false
  }, 500)
})
</script>