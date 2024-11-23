<script setup lang="ts">
const props = defineProps({
  patientId: String,
  noShadow: { type: Boolean, default: false },
  useProxy: { type: Boolean, default: false },
})
const labs = [
  { id: '700', checked: true, name: 'Glucose' },
  { id: '828', checked: true, name: 'HbA1c' },
  { id: '705', checked: true, name: 'eGFR' },
  { id: '727', checked: true, name: 'LDL' },
  { id: '725', checked: false, name: 'Total cholesterol' },
  { id: '715', checked: false, name: 'Potassium' },
]
const remoteUrl = props.useProxy
  ? 'http://localhost:8000/lab-chart'
  : 'http://192.168.254.90/emrbidi/lab/main/labGraphCmp.php'
</script>

<template>
  <div class="mt-4 sm:grid sm:grid-cols-2 gap-4">
    <div
      v-for="lab in labs"
      class="flex"
      :class="{
        'print:hidden': !lab.checked,
        'p-4 bg-white border border-gray-200 rounded-lg shadow print:shadow-none print:p-0 print:border-none':
          !noShadow,
      }"
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
            remoteUrl +
            '?patientId=' +
            patientId +
            '&labCodeId=' +
            lab.id +
            '&labCountPerLabGraphCmp=13&curPage=1&pageAll=1'
          "
        />
      </div>
    </div>
  </div>
</template>
