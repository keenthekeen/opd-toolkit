<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import LabChartGrid from '@/components/LabChartGrid.vue'
import { debounce } from 'lodash-es'

const patientIdInput = ref('')
const patientId = ref('')
const search = () => {
  patientId.value = patientIdInput.value
}
const debouncedSearch = debounce(search, 500)
watch(patientIdInput, () => debouncedSearch())
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
        <Input id="patientId" v-model.trim="patientIdInput" type="number" class="w-full" />
        <p class="mt-2 text-xs text-gray-400">
          ไม่ใช่ HN; ดูจาก URL ที่หน้า "ประวัติการรักษา" e.g. 581135
        </p>
      </div>
      <template v-if="patientId">
        <LabChartGrid :patientId="patientId" />
        <p class="mt-6 text-center text-xs text-gray-400 print:hidden">
          Tick the checkbox to show/hide the lab graph on print
        </p>
      </template>
    </div>
  </main>
</template>
