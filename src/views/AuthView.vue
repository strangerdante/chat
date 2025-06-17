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
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">
            {{ isLogin ? 'Bienvenido de Nuevo' : 'Crear Cuenta' }}
          </h2>
          <p class="text-gray-600">
            {{ isLogin ? 'Inicia sesión en tu cuenta' : 'Únete a nuestra comunidad de chat' }}
          </p>
        </div>

        <LoginForm v-if="isLogin" @switch-mode="isLogin = false" />
        <RegisterForm v-else @switch-mode="isLogin = true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const isLogin = ref(true)
</script>