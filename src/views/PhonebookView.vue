<script setup lang="ts">
import PHONEBOOK from '@/phonebook.json'

const phonebook = PHONEBOOK
</script>
<template>
  <main>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">BIDI Phonebook</h2>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-2 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        <a
          v-for="item in phonebook"
          :href="'tel:' + item.phone"
          class="block p-4 bg-white border border-gray-200 rounded-lg shadow"
        >
          <p class="mb-1 text-lg">{{ item.name }}</p>
          <p class="text-xs text-gray-500">{{ item.phone }}</p>
        </a>
      </div>
    </div>
  </main>
</template>
