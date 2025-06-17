<template>
  <div class="relative inline-block">
    <div
      v-if="!src || imageError"
      :class="[
        'rounded-full flex items-center justify-center text-white font-semibold',
        sizeClasses[size],
        getBackgroundColor(displayName || alt)
      ]"
    >
      {{ getInitials(displayName || alt) }}
    </div>
    
    <img
      v-else
      :src="src"
      :alt="alt"
      :class="[
        'rounded-full object-cover',
        sizeClasses[size]
      ]"
      @error="handleImageError"
    />
    
    <div
      v-if="online !== null"
      :class="[
        'absolute bottom-0 right-0 rounded-full border-2 border-white',
        online ? 'bg-green-500' : 'bg-gray-400',
        badgeSizeClasses[size]
      ]"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  displayName: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  online: {
    type: Boolean,
    default: null
  }
})

const imageError = ref(false)

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg'
}

const badgeSizeClasses = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5'
}

// Colores predefinidos para los avatares
const avatarColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-slate-500',
  'bg-gray-500',
  'bg-zinc-500'
]

const getInitials = (name) => {
  if (!name) return '??'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    // Si solo hay una palabra, tomar las dos primeras letras
    return words[0].substring(0, 2).toUpperCase()
  } else {
    // Si hay múltiples palabras, tomar la primera letra de las dos primeras palabras
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  }
}

const getBackgroundColor = (name) => {
  if (!name) return avatarColors[0]
  
  // Generar un hash simple del nombre para seleccionar un color consistente
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a entero de 32 bits
  }
  
  // Usar el valor absoluto del hash para seleccionar un color
  const colorIndex = Math.abs(hash) % avatarColors.length
  return avatarColors[colorIndex]
}

const handleImageError = () => {
  imageError.value = true
}
</script>