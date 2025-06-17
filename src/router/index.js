import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import ChatView from '../views/ChatView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthView,
    meta: { requiresAuth: false }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Esperar a que termine de cargar el estado de autenticación
  if (authStore.loading) {
    // Crear una promesa que se resuelve cuando loading sea false
    await new Promise((resolve) => {
      const checkAuth = () => {
        if (!authStore.loading) {
          resolve()
        } else {
          // Revisar nuevamente en el siguiente tick
          setTimeout(checkAuth, 50)
        }
      }
      checkAuth()
    })
  }
  
  // Agregar un pequeño delay adicional para asegurar que el estado esté completamente actualizado
  if (to.meta.requiresAuth || (to.name === 'Auth' && authStore.isAuthenticated)) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.name === 'Auth' && authStore.isAuthenticated) {
    next('/chat')
  } else {
    next()
  }
})

export default router