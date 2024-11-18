<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'

const patientId = ref('')
const labs = { '700': 'Glucose', '828': 'A1C', '705': 'eGFR', '727': 'LDL' }
</script>

<template>
  <main>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">NCDs Lab Viewer</h2>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 px-2 sm:px-6 lg:px-8">
      <div class="w-full">
        <Label for="patientId" value="Patient ID" />
        <Input id="patientId" v-model.trim="patientId" type="number" class="mt-1 w-full" />
        <p class="mt-2 text-sm text-gray-500">ไม่ใช่ HN; ดูจาก URL ที่หน้า "ประวัติการรักษา" e.g. 581135</p>
      </div>
      <div v-if="patientId" class="mt-4 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="(name, id) in labs"
          class="flex p-4 bg-white border border-gray-200 rounded-lg shadow"
        >
          <div class="flex-none basis-8">
            <p class="text-xl md:text-2xl font-bold [writing-mode:vertical-lr]">{{ name }}</p>
          </div>
          <div class="flex-auto">
            <img
              class="max-w-full"
              :alt="name"
              :src="
                'http://192.168.254.90/emrbidi/lab/main/labGraphCmp.php?patientId=' +
                patientId +
                '&labCodeId=' +
                id +
                '&labCountPerLabGraphCmp=13&curPage=1&pageAll=1'
              "
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
