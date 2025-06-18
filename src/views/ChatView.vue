<template>
  <div class="h-screen bg-gray-100 flex relative">
    <!-- Mobile overlay -->
    <div 
      v-if="showSidebar && isMobile"
      @click="showSidebar = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-50',
        'w-80 lg:w-80',
        isMobile ? 'fixed inset-y-0 left-0' : 'relative',
        showSidebar ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- Header - Perfectly aligned with chat header -->
      <div class="bg-primary-600 text-white border-b border-primary-700" style="height: 89px;">
        <div class="h-full flex items-center justify-between px-4">
          <!-- Left section: Mobile menu button + User info -->
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Close button for mobile -->
            <button
              v-if="isMobile"
              @click="showSidebar = false"
              class="text-white/80 hover:text-white transition-colors lg:hidden p-1"
              title="Cerrar menú"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- User info -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <AvatarBadge
                :display-name="authStore.user?.displayName"
                :online="true"
                size="sm"
              />
              <div class="min-w-0 flex-1">
                <p class="font-semibold truncate text-sm leading-tight">{{ authStore.user?.displayName }}</p>
                <p class="text-xs text-white/80 truncate leading-tight">En línea</p>
              </div>
            </div>
          </div>
          
          <!-- Right section: Logout button -->
          <div class="flex-shrink-0">
            <button
              @click="logout"
              class="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              title="Cerrar sesión"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="chatStore.error" class="p-4 bg-red-50 border-b border-red-200">
        <div class="flex items-center justify-between">
          <p class="text-red-700 text-sm">{{ chatStore.error }}</p>
          <button
            @click="chatStore.clearError"
            class="text-red-500 hover:text-red-700 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex">
          <button
            @click="activeTab = 'rooms'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium transition-colors',
              activeTab === 'rooms'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              Salas
            </div>
          </button>
          <button
            @click="activeTab = 'users'"
            :class="[
              'flex-1 py-3 px-4 text-sm font-medium transition-colors',
              activeTab === 'users'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
              </svg>
              Usuarios
            </div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-hidden">
        <!-- Rooms Tab -->
        <div v-if="activeTab === 'rooms'" class="h-full flex flex-col">
          <!-- Create Room -->
          <div class="p-4 border-b border-gray-200">
            <div v-if="!showCreateRoom">
              <button
                @click="showCreateRoom = true"
                class="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear Sala
              </button>
            </div>
            
            <div v-else class="space-y-3">
              <input
                v-model="newRoomName"
                placeholder="Nombre de la sala"
                maxlength="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                @keyup.enter="handleCreateRoom"
              />
              <input
                v-model="newRoomDescription"
                placeholder="Descripción (opcional)"
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                @keyup.enter="handleCreateRoom"
              />
              <div class="flex gap-2">
                <button
                  @click="handleCreateRoom"
                  :disabled="!newRoomName.trim() || chatStore.loading"
                  class="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  Crear
                </button>
                <button
                  @click="cancelCreateRoom"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <!-- Rooms List -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="chatStore.rooms.length === 0" class="p-4 text-center text-gray-500">
              <p>No hay salas disponibles</p>
              <p class="text-sm mt-1">¡Crea tu primera sala para comenzar!</p>
            </div>
            
            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="room in chatStore.rooms"
                :key="room.id"
                :class="[
                  'p-4 cursor-pointer hover:bg-gray-50 transition-colors relative group',
                  chatStore.currentRoom?.id === room.id && chatStore.chatType === 'room' ? 'bg-primary-50 border-r-4 border-primary-600' : ''
                ]"
                @click="selectRoom(room)"
              >
                <div class="flex items-start gap-3">
                  <!-- Room Avatar -->
                  <div class="flex-shrink-0 mt-1">
                    <AvatarBadge
                      :display-name="room.name"
                      size="md"
                    />
                  </div>
                  
                  <!-- Room Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h3 class="font-semibold text-gray-900 truncate text-base">{{ room.name }}</h3>
                      <div class="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {{ formatTime(room.lastMessageTime) }}
                      </div>
                    </div>
                    
                    <!-- Last Message -->
                    <div class="flex items-center justify-between">
                      <div class="flex-1 min-w-0">
                        <p v-if="room.lastMessage && room.lastMessageUser" class="text-sm text-gray-600 truncate">
                          <span class="font-medium">{{ room.lastMessageUser }}:</span>
                          <span class="ml-1">{{ room.lastMessage }}</span>
                        </p>
                        <p v-else-if="room.lastMessage" class="text-sm text-gray-600 truncate">
                          {{ room.lastMessage }}
                        </p>
                        <p v-else-if="room.description" class="text-sm text-gray-500 truncate italic">
                          {{ room.description }}
                        </p>
                        <p v-else class="text-sm text-gray-400 italic">
                          No hay mensajes aún
                        </p>
                      </div>
                      
                      <!-- Delete button -->
                      <div v-if="chatStore.canDeleteRoom(room)" class="ml-2 flex-shrink-0">
                        <button
                          @click.stop="handleDeleteRoom(room)"
                          :disabled="chatStore.loading"
                          class="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full disabled:opacity-50 shadow-sm"
                          title="Eliminar sala"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-else-if="activeTab === 'users'" class="h-full">
          <UsersList 
            :online-users="chatStore.onlineUsers"
            @start-private-chat="handleStartPrivateChat"
          />
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <div v-if="!chatStore.currentChatInfo" class="flex-1 flex items-center justify-center bg-gray-50">
        <div class="text-center text-gray-500 p-4">
          <!-- Mobile menu button when no chat selected -->
          <button
            v-if="isMobile"
            @click="showSidebar = true"
            class="mb-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors lg:hidden"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Abrir Menú
          </button>
          
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="text-lg font-medium mb-2">Bienvenido a Vue Firebase Chat</h3>
          <p class="px-4">Selecciona una sala o inicia un chat privado para comenzar</p>
        </div>
      </div>

      <ChatRoom 
        v-else 
        :chat-info="chatStore.currentChatInfo" 
        :is-mobile="isMobile"
        @toggle-sidebar="showSidebar = true"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showDeleteModal = false"
    >
      <div
        @click.stop
        class="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Eliminar Sala</h3>
            <p class="text-sm text-gray-600">Esta acción no se puede deshacer</p>
          </div>
        </div>
        
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que quieres eliminar "<strong>{{ roomToDelete?.name }}</strong>"? 
          Todos los mensajes en esta sala se eliminarán permanentemente.
        </p>
        
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            :disabled="chatStore.loading"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            @click="confirmDeleteRoom"
            :disabled="chatStore.loading"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <svg v-if="chatStore.loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="chatStore.loading">Eliminando...</span>
            <span v-else>Eliminar Sala</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useChatStore } from '../stores/chatStore.js'
import ChatRoom from '../components/chat/ChatRoom.vue'
import UsersList from '../components/chat/UsersList.vue'
import AvatarBadge from '../components/ui/AvatarBadge.vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

const showCreateRoom = ref(false)
const newRoomName = ref('')
const newRoomDescription = ref('')
const showSidebar = ref(false)
const isMobile = ref(false)
const showDeleteModal = ref(false)
const roomToDelete = ref(null)
const activeTab = ref('rooms')

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    showSidebar.value = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) { // Less than 1 minute
    return 'ahora'
  } else if (diff < 3600000) { // Less than 1 hour
    return `${Math.floor(diff / 60000)}m`
  } else if (diff < 86400000) { // Less than 24 hours
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  } else if (diff < 604800000) { // Less than 7 days
    const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
    return days[date.getDay()]
  } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
  }
}

const handleCreateRoom = async () => {
  if (!newRoomName.value.trim()) return
  
  const roomId = await chatStore.createRoom(newRoomName.value, newRoomDescription.value)
  if (roomId) {
    cancelCreateRoom()
  }
}

const cancelCreateRoom = () => {
  showCreateRoom.value = false
  newRoomName.value = ''
  newRoomDescription.value = ''
}

const selectRoom = (room) => {
  chatStore.joinRoom(room)
  // Close sidebar on mobile after selecting room
  if (isMobile.value) {
    showSidebar.value = false
  }
}

const handleStartPrivateChat = (user) => {
  chatStore.startPrivateChat(user)
  // Close sidebar on mobile after starting private chat
  if (isMobile.value) {
    showSidebar.value = false
  }
}

const handleDeleteRoom = (room) => {
  // Clear any previous errors
  chatStore.clearError()
  roomToDelete.value = room
  showDeleteModal.value = true
}

const confirmDeleteRoom = async () => {
  if (!roomToDelete.value) return
  
  try {
    const success = await chatStore.deleteRoom(roomToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      roomToDelete.value = null
    }
    // If there's an error, it will be displayed in the error section
  } catch (error) {
    console.error('Error in confirmDeleteRoom:', error)
  }
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Intentar navegar de todas formas si hay un error
    router.push('/')
  }
}

// Handle window resize
const handleResize = () => {
  checkMobile()
}

onMounted(() => {
  chatStore.subscribeToRooms()
  chatStore.subscribeToOnlineUsers()
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chatStore.cleanup()
  window.removeEventListener('resize', handleResize)
})
</script>