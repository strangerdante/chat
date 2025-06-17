<template>
  <div class="relative">
    <!-- Emoji Button -->
    <button
      @click="togglePicker"
      class="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
      title="Agregar emoji"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Emoji Picker -->
    <div
      v-if="showPicker"
      class="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-80 overflow-hidden z-50"
      @click.stop
    >
      <!-- Categories -->
      <div class="flex gap-1 mb-3 border-b border-gray-200 pb-2 overflow-x-auto">
        <!-- Recent emojis category -->
        <button
          @click="selectedCategory = 'recent'"
          :class="[
            'p-2 rounded-md text-sm transition-colors flex-shrink-0',
            selectedCategory === 'recent'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
          title="Recientes"
        >
          🕒
        </button>
        
        <button
          v-for="category in categories"
          :key="category.name"
          @click="selectedCategory = category.name"
          :class="[
            'p-2 rounded-md text-sm transition-colors flex-shrink-0',
            selectedCategory === category.name
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          ]"
          :title="category.label"
        >
          {{ category.icon }}
        </button>
      </div>

      <!-- Emojis Grid Container -->
      <div class="overflow-y-auto max-h-48">
        <!-- Recent Emojis -->
        <div v-if="selectedCategory === 'recent'">
          <div v-if="recentEmojis.length === 0" class="text-center py-8 text-gray-500">
            <div class="text-3xl mb-2">🕒</div>
            <p class="text-sm">No hay emojis recientes</p>
            <p class="text-xs text-gray-400 mt-1">Los emojis que uses aparecerán aquí</p>
          </div>
          <div v-else class="grid grid-cols-8 gap-1">
            <button
              v-for="emoji in recentEmojis"
              :key="emoji"
              @click="selectEmoji(emoji)"
              class="p-2 text-lg hover:bg-gray-100 rounded-md transition-colors"
              :title="emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Category Emojis -->
        <div v-else class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in currentEmojis"
            :key="emoji"
            @click="selectEmoji(emoji)"
            class="p-2 text-lg hover:bg-gray-100 rounded-md transition-colors"
            :title="emoji"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay to close picker -->
    <div
      v-if="showPicker"
      @click="showPicker = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['emoji-selected'])

const showPicker = ref(false)
const selectedCategory = ref('recent')
const recentEmojis = ref([])

// Load recent emojis from localStorage
const loadRecentEmojis = () => {
  try {
    const stored = localStorage.getItem('chat-recent-emojis')
    if (stored) {
      recentEmojis.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading recent emojis:', error)
    recentEmojis.value = []
  }
}

// Save recent emojis to localStorage
const saveRecentEmojis = () => {
  try {
    localStorage.setItem('chat-recent-emojis', JSON.stringify(recentEmojis.value))
  } catch (error) {
    console.error('Error saving recent emojis:', error)
  }
}

// Add emoji to recent list
const addToRecent = (emoji) => {
  // Remove if already exists
  const index = recentEmojis.value.indexOf(emoji)
  if (index > -1) {
    recentEmojis.value.splice(index, 1)
  }
  
  // Add to beginning
  recentEmojis.value.unshift(emoji)
  
  // Keep only last 32 emojis (4 rows of 8)
  if (recentEmojis.value.length > 32) {
    recentEmojis.value = recentEmojis.value.slice(0, 32)
  }
  
  saveRecentEmojis()
}

const categories = [
  { name: 'smileys', label: 'Caritas', icon: '😀' },
  { name: 'people', label: 'Personas', icon: '👋' },
  { name: 'nature', label: 'Naturaleza', icon: '🌱' },
  { name: 'food', label: 'Comida', icon: '🍎' },
  { name: 'activities', label: 'Actividades', icon: '⚽' },
  { name: 'travel', label: 'Viajes', icon: '🚗' },
  { name: 'objects', label: 'Objetos', icon: '💡' },
  { name: 'symbols', label: 'Símbolos', icon: '❤️' }
]

const emojis = {
  smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
    '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
    '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢',
    '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠',
    '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️'
  ],
  people: [
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️',
    '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕',
    '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜',
    '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅',
    '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
    '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄'
  ],
  nature: [
    '🌱', '🌿', '🍀', '🍃', '🍂', '🍁', '🌾', '🌵',
    '🌲', '🌳', '🌴', '🌸', '🌺', '🌻', '🌹', '🥀',
    '🌷', '🌼', '🌻', '🏵️', '💐', '🍄', '🌰', '🎋',
    '🎍', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗',
    '🌘', '🌑', '🌒', '🌓', '🌔', '🌝', '🌞', '⭐',
    '🌟', '💫', '✨', '☄️', '☀️', '🌤️', '⛅', '🌦️'
  ],
  food: [
    '🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
    '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅',
    '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕',
    '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨',
    '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩',
    '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙'
  ],
  activities: [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
    '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
    '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
    '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿',
    '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺',
    '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵'
  ],
  travel: [
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
    '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️',
    '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵',
    '🚤', '🛥️', '🛳️', '⛴️', '🚂', '🚃', '🚄', '🚅',
    '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋'
  ],
  objects: [
    '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵',
    '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰',
    '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱',
    '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️',
    '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿',
    '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺'
  ],
  symbols: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
    '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
    '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️'
  ]
}

const currentEmojis = computed(() => {
  return emojis[selectedCategory.value] || []
})

const togglePicker = () => {
  showPicker.value = !showPicker.value
  // Auto-select recent category when opening
  if (showPicker.value) {
    selectedCategory.value = 'recent'
  }
}

const selectEmoji = (emoji) => {
  addToRecent(emoji)
  emit('emoji-selected', emoji)
  showPicker.value = false
}

// Close picker when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showPicker.value = false
  }
}

onMounted(() => {
  loadRecentEmojis()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>