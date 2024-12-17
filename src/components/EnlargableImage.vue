<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'

defineProps<{ src: string, alt?: string }>()
const show = ref(false)
</script>

<template>
  <img @click="show = true" :src="src" :alt="alt" class="max-w-full cursor-pointer" v-bind="$attrs" />
  <Modal :show="show" @close="show = false" max-width="4xl">
    <div class="p-4">
      <img :src="src" :alt="alt" class="w-full" />
    </div>
  </Modal>
</template>
