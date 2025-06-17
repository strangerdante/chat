<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="bg-white border-b border-gray-200 p-4" style="height: 89px;">
      <div class="h-full flex items-center justify-between">
        <!-- Mobile hamburger button + Chat info -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <!-- Hamburger button for mobile -->
          <button
            v-if="isMobile"
            @click="$emit('toggle-sidebar')"
            class="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <!-- Chat info -->
          <div class="min-w-0 flex-1 flex items-center gap-3">
            <!-- Chat type icon -->
            <div class="flex-shrink-0">
              <div v-if="chatInfo.type === 'private'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                </svg>
              </div>
              <div v-else class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
            
            <div class="min-w-0 flex-1">
              <h2 class="text-xl font-semibold text-gray-800 truncate">{{ chatInfo.name }}</h2>
              <p v-if="chatInfo.description" class="text-sm text-gray-600 truncate">{{ chatInfo.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- Online indicator (only for rooms) -->
        <div v-if="chatInfo.type === 'room'" class="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
          <OnlineIndicator :count="onlineCount" />
        </div>
        
        <!-- Private chat status -->
        <div v-else class="flex items-center gap-2 text-sm text-green-600 flex-shrink-0">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>En línea</span>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <MessageList
      :messages="chatStore.currentMessages"
      :current-user-id="authStore.user?.uid"
      class="flex-1"
    />

    <!-- Message Composer -->
    <MessageComposer
      @send-message="handleSendMessage"
      @typing="handleTyping"
      :disabled="chatStore.loading"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useChatStore } from '../../stores/chatStore.js'
import MessageList from './MessageList.vue'
import MessageComposer from './MessageComposer.vue'
import OnlineIndicator from '../ui/OnlineIndicator.vue'

const props = defineProps({
  chatInfo: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-sidebar'])

const authStore = useAuthStore()
const chatStore = useChatStore()

const onlineCount = computed(() => chatStore.onlineUsers.length)

const handleSendMessage = async (content) => {
  await chatStore.sendMessage(content)
}

const handleTyping = (isTyping) => {
  if (props.chatInfo.type === 'room') {
    chatStore.setTyping(isTyping)
  }
}

onMounted(() => {
  // Online users are already subscribed in ChatView
})
</script>