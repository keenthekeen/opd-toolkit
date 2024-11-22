<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'

const patientId = ref('')
const labs = [
  { id: '700', checked: true, name: 'Glucose' },
  { id: '828', checked: true, name: 'HbA1c' },
  { id: '705', checked: true, name: 'eGFR' },
  { id: '727', checked: true, name: 'LDL' },
  { id: '725', checked: false, name: 'Total cholesterol' },
  { id: '715', checked: false, name: 'Potassium' },
]
</script>

<template>
  <main>
    <header class="bg-white shadow print:hidden">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">NCDs Lab Viewer</h2>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-2 sm:px-6 lg:px-8 print:p-0 print:max-w-full">
      <div class="w-full print:hidden">
        <Label for="patientId" value="Patient ID" />
        <Input id="patientId" v-model.trim="patientId" type="number" class="w-full" />
        <p class="mt-2 text-xs text-gray-400">
          ไม่ใช่ HN; ดูจาก URL ที่หน้า "ประวัติการรักษา" e.g. 581135
        </p>
      </div>
      <div v-if="patientId" class="mt-4 sm:grid sm:grid-cols-2 gap-4">
        <div
          v-for="lab in labs"
          class="flex p-4 bg-white border border-gray-200 rounded-lg shadow print:shadow-none print:p-0 print:border-none"
          :class="{ 'print:hidden': !lab.checked }"
        >
          <div class="flex-none basis-4">
            <p class="pb-1 text-center print:hidden">
              <input
                v-model="lab.checked"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-gray-400 focus:ring-gray-400"
              />
            </p>
            <p class="text-lg md:text-xl font-bold [writing-mode:vertical-lr]">{{ lab.name }}</p>
          </div>
          <div class="flex-auto">
            <img
              class="max-w-full"
              :alt="lab.name"
              :src="
                'http://192.168.254.90/emrbidi/lab/main/labGraphCmp.php?patientId=' +
                patientId +
                '&labCodeId=' +
                lab.id +
                '&labCountPerLabGraphCmp=13&curPage=1&pageAll=1'
              "
            />
          </div>
        </div>
      </div>
      <p class="mt-6 text-center text-xs text-gray-400 print:hidden">
        Tick the checkbox to show/hide the lab graph on print
      </p>
    </div>
  </main>
</template>
