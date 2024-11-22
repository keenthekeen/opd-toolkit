<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const openMobileNav = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="bg-white print:hidden">
      <nav
        class="mx-auto max-w-7xl flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <a href="/" class="-m-1.5 p-1.5 bg-orange-600 text-white">
            <span class="text-lg font-bold">Toolkit</span>
          </a>
        </div>
        <div class="flex lg:hidden">
          <button
            @click="openMobileNav = true"
            type="button"
            class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div class="hidden lg:flex lg:gap-x-12">
          <a href="/ncd" class="text-sm/6 font-semibold text-gray-900">NCDs OPD</a>
          <a href="/lab" class="text-sm/6 font-semibold text-gray-900">NCDs Labs</a>
          <a href="/phonebook" class="text-sm/6 font-semibold text-gray-900">Phonebook</a>
        </div>
        <!-- div class="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" class="text-sm/6 font-semibold text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
        </div -->
      </nav>
      <!-- Mobile menu, show/hide based on menu open state. -->
      <div v-show="openMobileNav" class="lg:hidden" role="dialog" aria-modal="true">
        <!-- Background backdrop, show/hide based on slide-over state. -->
        <div class="fixed inset-0 z-10"></div>
        <div
          class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div class="flex items-center justify-between">
            <button
              @click="openMobileNav = false"
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span class="sr-only">Close menu</span>
              <svg
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a
                  href="/ncd"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >NCDs OPD</a
                >
                <a
                  href="/lab"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >NCDs Labs</a
                >
                <a
                  href="/phonebook"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >Phonebook</a
                >
              </div>
              <!-- div class="py-6">
                <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Log in</a>
              </div -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <RouterView />
    <p class="py-4 text-center text-xs text-gray-400 print:hidden">Created with ❤ by Keen</p>
  </div>
</template>
