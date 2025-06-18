<template>
  <div :class="['flex', isOwn ? 'justify-end' : 'justify-start']">
    <div :class="['max-w-xs lg:max-w-md', isOwn ? 'order-2' : 'order-1']">
      <div class="flex items-end gap-2">
        <AvatarBadge
          v-if="!isOwn"
          :display-name="message.userName"
          size="xs"
          class="mb-1"
        />
        
        <div>
          <div v-if="!isOwn" class="text-xs text-gray-500 mb-1 ml-2">
            {{ message.userName }}
          </div>
          
          <div
            :class="[
              'px-4 py-2 rounded-2xl shadow-sm',
              isOwn
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
            ]"
          >
            <p class="text-sm leading-relaxed">{{ message.content }}</p>
          </div>
          
          <div
            :class="[
              'text-xs mt-1 flex items-center gap-1',
              isOwn ? 'justify-end mr-2' : 'justify-start ml-2'
            ]"
          >
            <span :class="isOwn ? 'text-gray-400' : 'text-gray-400'">
              {{ formatTimestamp(message.createdAt) }}
            </span>
            
            <!-- Read receipt indicator for private chats -->
            <div v-if="isOwn && showReadReceipt" class="flex items-center gap-1">
              <span class="text-gray-400">•</span>
              <div v-if="isMessageRead" class="flex items-center gap-1">
                <svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-blue-500 text-xs">Leído</span>
              </div>
              <div v-else class="flex items-center gap-1">
                <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-400 text-xs">Enviado</span>
              </div>
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
import { useChatStore } from '../../stores/chatStore.js'
import AvatarBadge from '../ui/AvatarBadge.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
})

const authStore = useAuthStore()
const chatStore = useChatStore()

// Show read receipt only for private chats
const showReadReceipt = computed(() => {
  return chatStore.chatType === 'private'
})

// Check if message has been read by the other user
const isMessageRead = computed(() => {
  if (!props.message.readBy || !showReadReceipt.value) return false
  
  // Get the other user's ID (not the current user)
  const otherUserId = Object.keys(props.message.readBy).find(
    userId => userId !== authStore.user?.uid
  )
  
  return !!otherUserId
})

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) { // Less than 1 minute
    return 'Ahora mismo'
  } else if (diff < 3600000) { // Less than 1 hour
    return `hace ${Math.floor(diff / 60000)}m`
  } else if (diff < 86400000) { // Less than 24 hours
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }
}
</script>