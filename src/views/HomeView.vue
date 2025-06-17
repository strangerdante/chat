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
    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/20">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          <span class="block sm:inline">Vue.js</span>
          <span class="block sm:inline"> Chat</span>
        </h1>
        <p class="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
          Chat en tiempo real. Crea salas, comparte mensajes y mantente conectado con una experiencia de chat moderna.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
          <router-link
            v-if="!isAuthenticated"
            to="/auth"
            class="w-full sm:w-auto bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Comenzar
          </router-link>
          
          <router-link
            v-else
            to="/chat"
            class="w-full sm:w-auto bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Abrir Chat
          </router-link>
          
          <div class="text-white/80 text-sm mt-4 sm:mt-0 sm:ml-6">
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div class="flex items-center gap-2 justify-center sm:justify-start">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs sm:text-sm">Mensajería en tiempo real</span>
              </div>
              <div class="flex items-center gap-2 justify-center sm:justify-start">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs sm:text-sm">Autenticación segura</span>
              </div>
              <div class="flex items-center gap-2 justify-center sm:justify-start">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                <span class="text-xs sm:text-sm">Múltiples salas de chat</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Credits -->
        <div class="border-t border-white/20 pt-4 sm:pt-6 mt-6 sm:mt-8">
          <p class="text-white/70 text-xs sm:text-sm">
            © 2024 Jamel Pimienta - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore.js'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>