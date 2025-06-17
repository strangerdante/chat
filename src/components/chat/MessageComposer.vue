<template>
  <div class="bg-white border-t border-gray-200 p-4">
    <div class="flex items-center gap-3">
      <div class="flex-1 relative">
        <!-- Input container with emoji button inside -->
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="message"
            @keydown="handleKeydown"
            @input="handleInput"
            placeholder="Escribe un mensaje..."
            rows="1"
            class="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32 overflow-hidden"
            style="min-height: 44px; scrollbar-width: none; -ms-overflow-style: none;"
          ></textarea>
          
          <!-- Emoji Picker Button inside input -->
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2">
            <EmojiPicker @emoji-selected="insertEmoji" />
          </div>
        </div>
      </div>
      
      <button
        @click="sendMessage"
        :disabled="!message.trim() || disabled"
        :class="[
          'w-11 h-11 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0',
          message.trim() && !disabled
            ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import EmojiPicker from './EmojiPicker.vue'

const emit = defineEmits(['send-message', 'typing'])

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const message = ref('')
const textareaRef = ref(null)
let typingTimer = null

const sendMessage = () => {
  if (!message.value.trim()) return
  
  emit('send-message', message.value.trim())
  message.value = ''
  emit('typing', false)
  
  // Reset textarea height
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = 'min-content'
    }
  })
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

const handleInput = () => {
  emit('typing', true)
  
  // Clear existing timer
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
  
  // Set new timer to stop typing indicator
  typingTimer = setTimeout(() => {
    emit('typing', false)
  }, 1000)
  
  // Auto-resize textarea
  autoResize()
}

const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      const scrollHeight = textareaRef.value.scrollHeight
      const maxHeight = 128 // max-h-32 = 8rem = 128px
      
      if (scrollHeight <= maxHeight) {
        textareaRef.value.style.height = scrollHeight + 'px'
        textareaRef.value.style.overflowY = 'hidden'
      } else {
        textareaRef.value.style.height = maxHeight + 'px'
        textareaRef.value.style.overflowY = 'auto'
      }
    }
  })
}

const insertEmoji = (emoji) => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = message.value
  
  // Insert emoji at cursor position
  message.value = text.slice(0, start) + emoji + text.slice(end)
  
  // Restore cursor position after emoji
  nextTick(() => {
    const newPosition = start + emoji.length
    textarea.setSelectionRange(newPosition, newPosition)
    textarea.focus()
    
    // Trigger input event to update typing status
    handleInput()
  })
}

// Auto-resize textarea when message changes
watch(message, () => {
  autoResize()
})
</script>

<style scoped>
/* Hide scrollbar for webkit browsers */
textarea::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
textarea {
  scrollbar-width: none;
}

/* Hide scrollbar for IE and Edge */
textarea {
  -ms-overflow-style: none;
}
</style>