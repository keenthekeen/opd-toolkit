<script setup lang="ts">
// @ts-nocheck
import { onMounted, useTemplateRef } from 'vue'

defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])
const input = useTemplateRef('input')

onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value.focus()
  }
})

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <input
    ref="input"
    class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
