<template>
  <div class="flex-1 overflow-y-auto bg-gray-50 p-4" ref="messagesContainer">
    <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No hay mensajes aún</p>
        <p class="text-sm mt-1">¡Inicia la conversación!</p>
      </div>
    </div>

    <div v-else class="space-y-4">
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :is-own="message.userId === currentUserId"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MessageItem from './MessageItem.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
})

const messagesContainer = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Auto-scroll when new messages arrive
watch(() => props.messages.length, () => {
  scrollToBottom()
})
</script>