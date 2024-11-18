<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'

defineProps<{ src: string | string[] }>()
const show = ref(false)
</script>

<template>
  <a @click="show = true" class="text-blue-700 cursor-pointer mt-0.5" v-bind="$attrs">
    <slot />
  </a>
  <Modal :show="show" @close="show = false">
    <div class="m-4">
      <div class="mb-4 text-lg">
        <slot />
      </div>
      <img
        v-for="s in Array.isArray(src) ? src : [src]"
        :key="s"
        :src="s"
        alt="asset"
        class="block max-w-80 sm:max-w-full pb-2 mb-2 border-b"
      />
    </div>
  </Modal>
</template>
