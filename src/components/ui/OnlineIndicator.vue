<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-1">
      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span class="text-sm text-gray-600">{{ count }} en línea</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 0
  }
})
</script>