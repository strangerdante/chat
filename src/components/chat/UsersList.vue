<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <h3 class="font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
        </svg>
        Usuarios en línea
      </h3>
    </div>

    <!-- Users List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="onlineUsers.length === 0" class="p-4 text-center text-gray-500">
        <div class="text-gray-300 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.197m3 2.197V9a3 3 0 00-6 0v2m0 0V9a3 3 0 016 0v2m0 0V9a3 3 0 00-6 0v2"/>
          </svg>
        </div>
        <p class="text-sm">No hay usuarios en línea</p>
      </div>
      
      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
          @click="startPrivateChat(user)"
        >
          <div class="flex items-center gap-3">
            <AvatarBadge
              :display-name="user.displayName"
              :online="true"
              size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ user.displayName }}</p>
              <p class="text-sm text-gray-500">Disponible para chat</p>
            </div>
            <div class="flex-shrink-0">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import AvatarBadge from '../ui/AvatarBadge.vue'

const props = defineProps({
  onlineUsers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['start-private-chat'])

const authStore = useAuthStore()

// Filter out current user from the list
const filteredUsers = computed(() => {
  return props.onlineUsers.filter(user => user.id !== authStore.user?.uid)
})

const startPrivateChat = (user) => {
  emit('start-private-chat', user)
}
</script>