<template>
  <div>
    <LoginForm v-if="isLogin" @switch-mode="isLogin = false" />
    <RegisterForm v-else @switch-mode="isLogin = true" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const isLogin = ref(true)
</script>