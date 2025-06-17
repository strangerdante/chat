import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  limit,
  getDocs,
  getDoc,
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuthStore } from './authStore.js'

export const useChatStore = defineStore('chat', () => {
  const rooms = ref([])
  const currentRoom = ref(null)
  const messages = ref([])
  const onlineUsers = ref([])
  const typingUsers = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Private chat state
  const privateChats = ref([])
  const currentPrivateChat = ref(null)
  const privateChatMessages = ref([])
  const chatType = ref('room') // 'room' or 'private'

  const authStore = useAuthStore()
  
  let messagesUnsubscribe = null
  let roomsUnsubscribe = null
  let privateChatUnsubscribe = null
  let onlineUsersUnsubscribe = null
  let typingTimeout = null

  // Create a new chat room
  const createRoom = async (roomName, description = '') => {
    try {
      loading.value = true
      const roomData = {
        name: roomName,
        description,
        createdBy: authStore.user.uid,
        createdAt: serverTimestamp(),
        lastMessage: null,
        lastMessageTime: null,
        lastMessageUser: null,
        memberCount: 0
      }
      
      const docRef = await addDoc(collection(db, 'rooms'), roomData)
      return docRef.id
    } catch (err) {
      console.error('Error creating room:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete a chat room (only by creator)
  const deleteRoom = async (roomId) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Starting room deletion for:', roomId)
      
      // Verificar primero que el usuario actual sea el creador
      const roomRef = doc(db, 'rooms', roomId)
      const roomDoc = await getDoc(roomRef)
      
      if (!roomDoc.exists()) {
        throw new Error('La sala no existe')
      }
      
      const roomData = roomDoc.data()
      if (roomData.createdBy !== authStore.user.uid) {
        throw new Error('No tienes permisos para eliminar esta sala')
      }
      
      // If the deleted room was the current room, clear it first
      if (currentRoom.value?.id === roomId) {
        console.log('Clearing current room')
        currentRoom.value = null
        messages.value = []
        if (messagesUnsubscribe) {
          messagesUnsubscribe()
          messagesUnsubscribe = null
        }
      }
      
      // Usar batch para eliminar todo de manera más eficiente
      const batch = writeBatch(db)
      
      // First, get all messages in the room
      const messagesQuery = query(collection(db, 'rooms', roomId, 'messages'))
      const messagesSnapshot = await getDocs(messagesQuery)
      
      console.log('Found messages to delete:', messagesSnapshot.size)
      
      // Add message deletions to batch
      messagesSnapshot.docs.forEach(messageDoc => {
        batch.delete(doc(db, 'rooms', roomId, 'messages', messageDoc.id))
      })
      
      // Get typing indicators
      const typingQuery = query(collection(db, 'rooms', roomId, 'typing'))
      const typingSnapshot = await getDocs(typingQuery)
      
      console.log('Found typing indicators to delete:', typingSnapshot.size)
      
      // Add typing indicator deletions to batch
      typingSnapshot.docs.forEach(typingDoc => {
        batch.delete(doc(db, 'rooms', roomId, 'typing', typingDoc.id))
      })
      
      // Add room deletion to batch
      batch.delete(roomRef)
      
      // Execute all deletions in a single batch
      await batch.commit()
      console.log('Room and all related data deleted successfully')
      
      return true
    } catch (err) {
      console.error('Error deleting room:', err)
      error.value = `Error al eliminar la sala: ${err.message}`
      return false
    } finally {
      loading.value = false
    }
  }

  // Subscribe to rooms list
  const subscribeToRooms = () => {
    try {
      const q = query(collection(db, 'rooms'), orderBy('lastMessageTime', 'desc'))
      
      roomsUnsubscribe = onSnapshot(q, (snapshot) => {
        rooms.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      }, (err) => {
        console.error('Error in rooms subscription:', err)
        error.value = 'Error al cargar las salas'
      })
    } catch (err) {
      console.error('Error subscribing to rooms:', err)
      error.value = 'Error al conectar con las salas'
    }
  }

  // Subscribe to online users
  const subscribeToOnlineUsers = () => {
    try {
      const q = query(collection(db, 'users'), where('isOnline', '==', true))
      
      onlineUsersUnsubscribe = onSnapshot(q, (snapshot) => {
        onlineUsers.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      }, (err) => {
        console.error('Error in online users subscription:', err)
      })
    } catch (err) {
      console.error('Error subscribing to online users:', err)
    }
  }

  // Join a chat room
  const joinRoom = (room) => {
    try {
      if (messagesUnsubscribe) {
        messagesUnsubscribe()
        messagesUnsubscribe = null
      }
      
      if (privateChatUnsubscribe) {
        privateChatUnsubscribe()
        privateChatUnsubscribe = null
      }
      
      currentRoom.value = room
      currentPrivateChat.value = null
      chatType.value = 'room'
      messages.value = []
      privateChatMessages.value = []
      
      // Subscribe to messages for this room
      subscribeToMessages(room.id)
    } catch (err) {
      console.error('Error joining room:', err)
      error.value = 'Error al unirse a la sala'
    }
  }

  // Generate private chat ID
  const generatePrivateChatId = (userId1, userId2) => {
    return [userId1, userId2].sort().join('_')
  }

  // Start private chat
  const startPrivateChat = async (user) => {
    try {
      if (messagesUnsubscribe) {
        messagesUnsubscribe()
        messagesUnsubscribe = null
      }
      
      if (privateChatUnsubscribe) {
        privateChatUnsubscribe()
        privateChatUnsubscribe = null
      }

      const chatId = generatePrivateChatId(authStore.user.uid, user.id)
      
      // Create or get private chat document
      const chatRef = doc(db, 'privateChats', chatId)
      const chatDoc = await getDoc(chatRef)
      
      if (!chatDoc.exists()) {
        await setDoc(chatRef, {
          participants: [authStore.user.uid, user.id],
          participantNames: {
            [authStore.user.uid]: authStore.user.displayName,
            [user.id]: user.displayName
          },
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageTime: null,
          lastMessageUser: null
        })
      }

      currentPrivateChat.value = {
        id: chatId,
        user: user,
        ...chatDoc.data()
      }
      currentRoom.value = null
      chatType.value = 'private'
      messages.value = []
      privateChatMessages.value = []
      
      // Subscribe to private chat messages
      subscribeToPrivateChatMessages(chatId)
    } catch (err) {
      console.error('Error starting private chat:', err)
      error.value = 'Error al iniciar chat privado'
    }
  }

  // Subscribe to messages in a room
  const subscribeToMessages = (roomId) => {
    try {
      const q = query(
        collection(db, 'rooms', roomId, 'messages'),
        orderBy('createdAt', 'asc')
      )
      
      messagesUnsubscribe = onSnapshot(q, (snapshot) => {
        messages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      }, (err) => {
        console.error('Error in messages subscription:', err)
        error.value = 'Error al cargar los mensajes'
      })
    } catch (err) {
      console.error('Error subscribing to messages:', err)
      error.value = 'Error al conectar con los mensajes'
    }
  }

  // Subscribe to private chat messages
  const subscribeToPrivateChatMessages = (chatId) => {
    try {
      const q = query(
        collection(db, 'privateChats', chatId, 'messages'),
        orderBy('createdAt', 'asc')
      )
      
      privateChatUnsubscribe = onSnapshot(q, (snapshot) => {
        privateChatMessages.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        // Mark messages as read when they come in
        markMessagesAsRead(chatId)
      }, (err) => {
        console.error('Error in private chat messages subscription:', err)
        error.value = 'Error al cargar los mensajes privados'
      })
    } catch (err) {
      console.error('Error subscribing to private chat messages:', err)
      error.value = 'Error al conectar con los mensajes privados'
    }
  }

  // Mark messages as read
  const markMessagesAsRead = async (chatId) => {
    try {
      const batch = writeBatch(db)
      const currentUserId = authStore.user.uid
      
      // Get unread messages from the other user
      const unreadMessages = privateChatMessages.value.filter(message => 
        message.userId !== currentUserId && 
        (!message.readBy || !message.readBy[currentUserId])
      )
      
      // Mark each unread message as read
      unreadMessages.forEach(message => {
        const messageRef = doc(db, 'privateChats', chatId, 'messages', message.id)
        batch.update(messageRef, {
          [`readBy.${currentUserId}`]: serverTimestamp()
        })
      })
      
      if (unreadMessages.length > 0) {
        await batch.commit()
      }
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }

  // Send a message
  const sendMessage = async (content) => {
    if (!content.trim()) return
    
    try {
      const messageData = {
        content: content.trim(),
        userId: authStore.user.uid,
        userName: authStore.user.displayName,
        createdAt: serverTimestamp(),
        readBy: {
          [authStore.user.uid]: serverTimestamp() // Mark as read by sender immediately
        }
      }
      
      if (chatType.value === 'room' && currentRoom.value) {
        // Send to room (no read receipts for rooms)
        delete messageData.readBy
        await addDoc(collection(db, 'rooms', currentRoom.value.id, 'messages'), messageData)
        
        // Update room's last message
        await updateDoc(doc(db, 'rooms', currentRoom.value.id), {
          lastMessage: content.trim(),
          lastMessageTime: serverTimestamp(),
          lastMessageUser: authStore.user.displayName
        })
      } else if (chatType.value === 'private' && currentPrivateChat.value) {
        // Send to private chat with read receipts
        await addDoc(collection(db, 'privateChats', currentPrivateChat.value.id, 'messages'), messageData)
        
        // Update private chat's last message
        await updateDoc(doc(db, 'privateChats', currentPrivateChat.value.id), {
          lastMessage: content.trim(),
          lastMessageTime: serverTimestamp(),
          lastMessageUser: authStore.user.displayName
        })
      }
      
      return true
    } catch (err) {
      console.error('Error sending message:', err)
      error.value = 'Error al enviar el mensaje'
      return false
    }
  }

  // Handle typing indicator
  const setTyping = async (isTyping) => {
    if (!currentRoom.value) return
    
    try {
      const typingRef = doc(db, 'rooms', currentRoom.value.id, 'typing', authStore.user.uid)
      
      if (isTyping) {
        await setDoc(typingRef, {
          userName: authStore.user.displayName,
          timestamp: serverTimestamp()
        })
        
        // Clear typing after 3 seconds
        if (typingTimeout) clearTimeout(typingTimeout)
        typingTimeout = setTimeout(() => {
          setTyping(false)
        }, 3000)
      } else {
        await setDoc(typingRef, {
          userName: authStore.user.displayName,
          timestamp: null
        })
      }
    } catch (err) {
      console.error('Error setting typing status:', err)
    }
  }

  // Check if current user can delete a room
  const canDeleteRoom = (room) => {
    return authStore.user && room && room.createdBy === authStore.user.uid
  }

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Cleanup subscriptions
  const cleanup = () => {
    if (messagesUnsubscribe) {
      messagesUnsubscribe()
      messagesUnsubscribe = null
    }
    if (roomsUnsubscribe) {
      roomsUnsubscribe()
      roomsUnsubscribe = null
    }
    if (privateChatUnsubscribe) {
      privateChatUnsubscribe()
      privateChatUnsubscribe = null
    }
    if (onlineUsersUnsubscribe) {
      onlineUsersUnsubscribe()
      onlineUsersUnsubscribe = null
    }
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      typingTimeout = null
    }
  }

  // Computed properties
  const currentMessages = computed(() => {
    return chatType.value === 'private' ? privateChatMessages.value : messages.value
  })

  const currentChatInfo = computed(() => {
    if (chatType.value === 'private' && currentPrivateChat.value) {
      return {
        name: currentPrivateChat.value.user.displayName,
        description: 'Chat privado',
        type: 'private'
      }
    } else if (chatType.value === 'room' && currentRoom.value) {
      return {
        name: currentRoom.value.name,
        description: currentRoom.value.description,
        type: 'room'
      }
    }
    return null
  })

  return {
    rooms,
    currentRoom,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    error,
    privateChats,
    currentPrivateChat,
    privateChatMessages,
    chatType,
    currentMessages,
    currentChatInfo,
    createRoom,
    deleteRoom,
    subscribeToRooms,
    subscribeToOnlineUsers,
    joinRoom,
    startPrivateChat,
    sendMessage,
    setTyping,
    canDeleteRoom,
    clearError,
    cleanup,
    markMessagesAsRead
  }
})