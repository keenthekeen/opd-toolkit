<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import Modal from '@/components/Modal.vue'
import Label from '@/components/Label.vue'
import Input from '@/components/Input.vue'

const emit = defineEmits(['import'])
const show = ref(true)

const patientId = ref('')
const patientIdType = ref('hn')
const errorMessage = ref('')
const successMessage = ref('')
const search = async () => {
  if (patientId.value) {
    const response = await fetch(
      `http://localhost:8000/fetch-emr?${patientIdType.value}=${patientId.value}`,
    ).then((r) => r.json())
    if (response.sex) {
      emit('import', { ...response, id: patientId.value })
      successMessage.value = 'Imported ' + response.name
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
      show.value = false
    } else if (response.error) {
      errorMessage.value = response.error
    } else {
      errorMessage.value = 'Unexpected error'
    }
  }
}
const debouncedSearch = debounce(search, 500)
watch(patientId, () => {
  debouncedSearch()
})
</script>

<template>
  <a @click="show = true" class="text-orange-700 cursor-pointer mt-0.5" v-bind="$attrs">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
      />
    </svg>
  </a>
  <Modal :show="show" @close="show = false">
    <div class="m-4">
      <div class="mb-4 text-lg">Import EMR data</div>
      <fieldset>
        <legend class="text-sm/6 font-semibold text-gray-900">Search using</legend>
        <div class="mt-2 space-y-2">
          <div class="flex items-center gap-x-3">
            <input id="radio-hn" v-model="patientIdType" value="hn" type="radio" class="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
            <label for="radio-hn" class="block text-sm/6 font-medium text-gray-900">HN</label>
          </div>
          <div class="flex items-center gap-x-3">
            <input id="radio-patientId" v-model="patientIdType" value="patientId" type="radio" class="size-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
            <div>
            <label for="radio-patientId" class="block text-sm/6 font-medium text-gray-900">Patient ID</label>
            <p class="mt-2 text-xs text-gray-400">
              ไม่ใช่ HN; ดูจาก URL ที่หน้า "ประวัติการรักษา" e.g. 581135
            </p>
            </div>
          </div>
        </div>
      </fieldset>
      <div class="mt-4 w-full">
        <Label for="patientId" :value="(patientIdType=='hn') ? 'HN' : 'Patient ID'" />
        <Input id="patientId" v-model.trim="patientId" type="number" class="w-full" autofocus />
        <p v-if="errorMessage" class="mt-2 text-xs text-red-500">
          {{ errorMessage }}
        </p>
        <p v-else class="mt-2 text-xs text-gray-500">Require running EMR connector on your computer.</p>
      </div>
    </div>
  </Modal>
  <transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition duration-300"
    leave-active-class="transition duration-300"
  >
    <div
      v-show="successMessage"
      class="fixed top-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-white bg-emerald-500 rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div
        class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ successMessage }}</div>
    </div>
  </transition>
</template>
