<script setup lang="ts">
import AssetModal from '@/components/AssetModal.vue'
import FormSection from '@/components/FormSection.vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import SectionBorder from '../components/SectionBorder.vue'
import { computed, reactive, ref } from 'vue'
import STATIC from '@/ncd.json'
import { calculateASCVDRiskToText } from '@/CVRiskFunction'

const form = reactive({
  dx_dyslipidemia: true,
  dx_hypertension: true,
  dx_diabetes: false,
  note_general: '',
  note_dyslipidemia: '',
  note_hypertension: '',
  note_diabetes: '',
  feeling_well: true,
  smoking: false,
  age: '',
  sex: '1', // 0: female, 1: male
  height: '',
  weight: '',
  office_sbp: '',
  office_dbp: '',
  home_sbp: '',
  home_dbp: '',
  hypotensive_symptoms: false,
  ldl: '',
  total_cholesterol: '',
  lipid_when: '',
  myopathy: false,
  target_ldl: '',
  hba1c: '',
  hba1c_when: '',
  fasting_glucose: '',
  fasting_glucose_when: '',
  hypoglycemic_symptoms: false,
})
const history = ref(
  STATIC.history.map((item) => ({
    title: item,
    checked: false,
  })),
)
const hypertension_drugs = ref(
  STATIC.hypertension_drugs.map((drug) => ({
    ...drug,
    previous_dose: '',
    new_dose: '',
  })),
)
const dyslipidemia_drugs = ref(
  STATIC.dyslipidemia_drugs.map((drug) => ({
    ...drug,
    previous_dose: '',
    new_dose: '',
  })),
)
const diabetes_drugs = ref(
  STATIC.diabetes_drugs.map((drug) => ({
    ...drug,
    previous_dose: '',
    new_dose: '',
  })),
)
const lifestyle_modifications = ref(
  STATIC.lifestyle_modifications.map((item) => ({
    ...item,
    checked: item.checked ?? true,
  })),
)
const investigations = ref(
  STATIC.investigations.map((item) => ({
    ...item,
    checked: false,
    when: '',
    result: '',
  })),
)
const cvRisk = computed(() =>
  calculateASCVDRiskToText(
    Number(form.age),
    form.smoking,
    form.dx_diabetes,
    Number(form.home_sbp || form.office_sbp),
    Number(form.sex),
    Number(form.total_cholesterol),
  ),
)
</script>

<template>
  <main>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">NCDs OPD Kit</h2>
      </div>
    </header>

    <div class="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      <FormSection>
        <template #title>General</template>
        <template #description>
          <AssetModal class="block" src="/vaccine-adult.png">Vaccines for elderly</AssetModal>
          <p>Screening mammography every 1-2 years.</p>
          <p>Screening BMD in all women ≥65 years old.</p>
          <p>
            Annual low-dose chest CT scan screening for individuals ages 50 to 80 years with ≥20
            pack-year smoking history.
          </p>
        </template>
        <template #form>
          <div class="col-span-1">
            <Label for="age" value="Age (year)" />
            <Input id="age" v-model="form.age" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-2">
            <Label for="sex" value="Sex" />
            <select
              id="sex"
              v-model="form.sex"
              required
              class="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>
          <div class="col-span-2">
            <Label for="height" value="Height (cm)" />
            <Input id="height" v-model="form.height" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-1">
            <Label for="weight" value="Weight (kg)" />
            <Input id="weight" v-model="form.weight" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-3">
            <div class="relative flex gap-x-3 items-center">
              <div class="flex items-center">
                <input
                  id="feeling_well"
                  v-model="form.feeling_well"
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
                />
              </div>
              <div class="text-lg">
                <label for="feeling_well">Feeling well</label>
              </div>
            </div>
          </div>
          <div v-if="form.height && form.weight" class="col-span-3">
            BMI {{ (Number(form.weight) / (Number(form.height) / 100) ** 2).toFixed(2) }}
          </div>
          <div class="col-span-2 relative flex gap-x-3 items-center">
            <div class="flex h-6 items-center">
              <input
                id="smoking"
                v-model="form.smoking"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div class="text-sm/6">
              <label for="smoking" class="font-medium text-gray-900">Smoking</label>
            </div>
          </div>
          <div class="col-span-full">
            <textarea
              rows="2"
              placeholder="Note"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              v-model="form.note_general"
            ></textarea>
          </div>
          <div v-for="hx in history" class="col-span-2 relative flex gap-x-3 items-center">
            <div class="flex h-6 items-center">
              <input
                :id="hx.title"
                v-model="hx.checked"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div class="text-sm/6">
              <label :for="hx.title" class="font-medium text-gray-900">{{ hx.title }}</label>
            </div>
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Hypertension</template>
        <template #description>
          <AssetModal class="block" src="/ht-criteria.png">
            Criteria of diagnosis in different measurement methods
          </AssetModal>
          <AssetModal class="block" src="/ht-diag.png">Diagnostic algorithm</AssetModal>
          <AssetModal class="block" src="/ht-target.png">Target blood pressure levels</AssetModal>
          <template v-if="form.dx_hypertension">
            <AssetModal class="block" src="/ht-initial-drug.png"
              >First line antihypertensive
            </AssetModal>
            <AssetModal class="block" src="/ht-drug-choice.png"
              >Antihypertensive drug choices
            </AssetModal>
            <AssetModal class="block" src="/ht-utd-drug-approach.png"
              >UTD: Approach to antihypertensive
            </AssetModal>
            <AssetModal class="block" src="/ht-utd-drug-consideration.png"
              >UTD: Considerations for antihypertensive
            </AssetModal>
            <AssetModal class="block" src="/ht-utd-drug-adr.png"
              >UTD: Antihypertensive side effects
            </AssetModal>
            <a
              href="https://www.facebook.com/share/p/1CxueeJL9T/"
              target="_blank"
              class="block mt-0.5 text-cyan-700"
            >
              2023 ESH Guidelines for HT คลินิกแพทย์ครรชิต-แพทย์สุวิโชติ
            </a>
            <div class="mt-2">
              <span class="underline">Medications</span>
              <ul class="list-disc text-xs">
                <li>
                  May consider initial monotherapy in frail patient or low-grade hypertension + low
                  risk.
                </li>
                <li>
                  ACEI/ARBs are contraindicated in pregnancy/child-bearing potential, angioedema
                  (ACEI), bilateral renal artery stenosis, hyperkalemia (>5.5).
                </li>
                <li>
                  ACEI/ARBs: KDIGO 2021 recommended changes in BP, Cr, K+ checked 2–4 weeks of
                  initiation or increase in the dose. Continue ACEi or ARB therapy unless Cr↑ >30%
                  within 4 weeks.
                </li>
                <li>
                  Dihydropyridine CCBs are contraindicated in tachyarrhythmia, severe leg edema,
                  HFrEF class III-IV.
                </li>
                <li>
                  Non-dihydropyridine CCBs are contraindicated in bradycardia, high grade SA/AV
                  block, constipation, LVEF <40%.
                </li>
                <li>
                  Thiazides are contraindicated in gout, glucose intolerance, pregnancy, hyperCa,
                  hypoK.
                </li>
                <li>
                  Beta-blockers are contraindicated in asthma, bradycardia, high-grade SA/AV block,
                  COPD, athletes, depression, glucose intolerance.
                </li>
              </ul>
            </div>
          </template>
        </template>
        <template #form>
          <div class="col-span-6">
            <div class="relative flex gap-x-3 items-center">
              <div class="flex items-center">
                <input
                  id="dx_hypertension"
                  v-model="form.dx_hypertension"
                  type="checkbox"
                  class="size-6 rounded border-gray-300 text-black focus:ring-black"
                />
              </div>
              <div class="text-lg">
                <label for="dx_hypertension" class="font-medium">Hypertension</label>
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <Label for="office_sbp" value="Office SBP (mmHg)" />
            <Input id="office_sbp" v-model="form.office_sbp" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-1">
            <Label for="office_dbp" value="Office DBP" />
            <Input id="office_dbp" v-model="form.office_dbp" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-2">
            <Label for="home_sbp" value="Home SBP (mmHg)" />
            <Input id="home_sbp" v-model="form.home_sbp" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-1">
            <Label for="home_dbp" value="Home DBP" />
            <Input id="home_dbp" v-model="form.home_dbp" type="number" class="mt-1 w-full" />
          </div>
          <template v-if="form.dx_hypertension">
            <div class="col-span-6 relative flex gap-x-3 items-center">
              <div class="flex h-6 items-center">
                <input
                  id="hypotensive_symptoms"
                  v-model="form.hypotensive_symptoms"
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                />
              </div>
              <div class="text-sm/6">
                <label for="hypotensive_symptoms" class="font-medium text-gray-900"
                  >Hypotensive symptoms: Dizziness/syncope</label
                >
              </div>
            </div>
            <div class="col-span-full">
              <textarea
                id="note_hypertension"
                name="note_hypertension"
                rows="2"
                placeholder="Note"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                v-model="form.note_hypertension"
              ></textarea>
            </div>
            <div class="col-span-6">
              <span class="underline">Medications</span>
            </div>
            <div class="col-span-6">
              <table class="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Drug
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Dosage
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Previous (mg/day)
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
                      @click="
                        hypertension_drugs = hypertension_drugs.map((drug) => ({
                          ...drug,
                          new_dose: drug.previous_dose,
                        }))
                      "
                    >
                      New (mg/day)
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="drug in hypertension_drugs" :key="drug.name">
                    <td class="px-2 py-1 text-center">
                      <input
                        disabled
                        :checked="drug.previous_dose != '' || drug.new_dose != ''"
                        type="checkbox"
                        class="size-4 rounded border-gray-300 text-green-600"
                      />
                    </td>
                    <td class="px-2 py-1" :colspan="drug.initial_dose || drug.max_dose ? 1 : 2">
                      <span
                        v-if="drug.group"
                        class="px-0.5 mr-1 text-xs text-gray-400 outline outline-1 outline-gray-400 rounded"
                        >{{ drug.group }}</span
                      >
                      <span :class="{ 'line-through': drug.available === false }">{{
                        drug.name
                      }}</span>
                      <span v-if="drug.trade_name" class="mx-0.5">({{ drug.trade_name }})</span>
                      <span class="ml-1 inline-block text-xs text-gray-400">{{
                        drug.description
                      }}</span>
                    </td>
                    <td
                      class="px-2 py-1 text-xs text-gray-400"
                      v-if="drug.initial_dose || drug.max_dose"
                    >
                      <p v-if="drug.initial_dose">Initial {{ drug.initial_dose }}</p>
                      <p v-if="drug.max_dose">Max {{ drug.max_dose }}</p>
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.previous_dose" type="number" class="h-8 max-w-28" />
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.new_dose" type="number" class="h-8 max-w-28" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Dyslipidemia</template>
        <template #description>
          <a
            href="https://www.rama.mahidol.ac.th/cardio_vascular_risk/thai_cv_risk_score/"
            target="_blank"
            class="block text-cyan-700"
            >Thai CV risk score</a
          >
          <AssetModal
            class="block"
            :src="['/dlp-target-primary.png', '/dlp-target-dm.png', '/dlp-target-ckd.png']"
            >Approach to primary prevention
          </AssetModal>
          <AssetModal class="block" :src="['/dlp-target-cad.png', '/dlp-target-cva.png']"
            >Approach to secondary prevention
          </AssetModal>
          <template v-if="form.dx_dyslipidemia">
            <p>
              Look for genetic dyslipidemia in case of family history of premature CAD (<55-60 yr)
              or xanthoma. Look for secondary causes e.g. nephrotic syndrome, hypothyroidism,
              Cushing syndrome.
            </p>
            <p>
              Check AST, ALT before initiating statin. Check LDL-C, AST, ALT at 4-6 weeks after
              initiating statin, then every 1 year. Hold statin if AST, ALT > 3x UNL.
            </p>
            <p>
              Use fasting lipid profile before initiating primary prevention, in case of suspected
              genetic dyslipidemia, or TG>400.
            </p>
            <AssetModal class="block" src="/dlp-statin-intensity.png">Statin intensity</AssetModal>
            <AssetModal class="block" :src="['/dlp-drugs-1.png', '/dlp-drugs-2.png']"
              >Other medications
            </AssetModal>
            <AssetModal class="block" src="/dlp-drugs-ckd.png">Max doses in CKD</AssetModal>
          </template>
        </template>
        <template #form>
          <div class="col-span-6">
            <div class="relative flex gap-x-3 items-center">
              <div class="flex items-center">
                <input
                  id="dx_dyslipidemia"
                  v-model="form.dx_dyslipidemia"
                  type="checkbox"
                  class="size-6 rounded border-gray-300 text-black focus:ring-black"
                />
              </div>
              <div class="text-lg">
                <label for="dx_dyslipidemia" class="font-medium"
                  >Dyslipidemia / Cardiovascular risk</label
                >
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <Label for="ldl_value" value="Latest LDL-C (mg/dL)" />
            <Input id="ldl_value" v-model="form.ldl" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-2">
            <Label for="total_cholesterol" value="Total cholesterol (mg/dL)" />
            <Input
              id="total_cholesterol"
              v-model="form.total_cholesterol"
              type="number"
              class="mt-1 w-full"
            />
          </div>
          <div class="col-span-2">
            <Label for="lipid_when" value="Measured at" />
            <Input
              id="lipid_when"
              v-model="form.lipid_when"
              type="text"
              class="mt-1 w-full"
              placeholder="MM/YY"
            />
          </div>
          <div v-if="form.dx_dyslipidemia" class="col-span-2 relative flex gap-x-3 items-center">
            <div class="flex h-6 items-center">
              <input
                id="myopathy"
                v-model="form.myopathy"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
              />
            </div>
            <div class="text-sm/6">
              <label for="myopathy" class="font-medium text-gray-900">Myalgia/weakness/cramp</label>
            </div>
          </div>
          <p class="col-span-6 text-red-500" v-if="form.myopathy">
            ในกรณีที่มีอาการปวดกล้ามเนื้อ ปวดเมื่อย ตะคริวบ่อย ๆ ควรได้รับการตรวจเอนไซม์กล้ามเนื้อ
            แต่พึงระลึกเสมอว่า อาการเหล่านี้ รวมถึงค่า creatine kinase (CK) ที่ผิดปกติ
            อาจไม่ได้เกิดจาก statin เสมอไป อาจพิจารณาหยุด statin ชั่วคราว สังเกตอาการ
            และตรวจเลือดซ้ำภายหลังจากหยุดยา 2-4 สัปดาห์ หลังจากนั้นแนะนำให้ทดลองกลับไปใช้ยา statin
            ชนิดเดิมในขนาดเดิมหรือลดลง หากกลับมามีอาการหรือผลเลือดผิดปกติอีก
            แสดงว่าอาการดังกล่าวอาจเกิดจาก statin
          </p>
          <div class="col-span-full text-blue-500">
            {{ cvRisk }}
          </div>
          <div class="col-span-full">
            <textarea
              rows="2"
              placeholder="Note"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              v-model="form.note_dyslipidemia"
            ></textarea>
          </div>
          <template v-if="form.dx_dyslipidemia">
            <div class="col-span-6">
              <Label for="target_ldl" value="Target LDL" />
              <select
                id="target_ldl"
                v-model="form.target_ldl"
                required
                class="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value=""></option>
                <option v-for="option in STATIC.ldl_targets" :value="option">{{ option }}</option>
              </select>
            </div>
            <div class="col-span-6">
              <span class="underline">Medications</span>
            </div>
            <div class="col-span-6">
              <table class="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Drug
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Dosage
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Previous (mg/day)
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
                      @click="
                        dyslipidemia_drugs = dyslipidemia_drugs.map((drug) => ({
                          ...drug,
                          new_dose: drug.previous_dose,
                        }))
                      "
                    >
                      New (mg/day)
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="drug in dyslipidemia_drugs" :key="drug.name">
                    <td class="px-2 py-1 text-center">
                      <input
                        disabled
                        :checked="drug.previous_dose != '' || drug.new_dose != ''"
                        type="checkbox"
                        class="size-4 rounded border-gray-300 text-green-600"
                      />
                    </td>
                    <td class="px-2 py-1">
                      {{ drug.name }}
                      <span v-if="drug.trade_name" class="mx-0.5">({{ drug.trade_name }})</span>
                      <span class="text-xs text-gray-400">{{ drug.description }}</span>
                    </td>
                    <td class="px-2 py-1 text-xs text-gray-400">
                      {{ drug.dosage }}
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.previous_dose" type="number" class="h-8 max-w-28" />
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.new_dose" type="number" class="h-8 max-w-28" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Diabetes mellitus</template>
        <template #description>
          <AssetModal
            class="block"
            :src="['/dm-diagnosis-criteria.png', '/dm-diagnosis-investigate.png']"
            >Diagnostic criteria and assessment
          </AssetModal>
          <template v-if="form.dx_diabetes">
            <AssetModal class="block" :src="['/dm-target.png', '/dm-target-elderly.png']"
              >Target glucose level
            </AssetModal>
            <AssetModal class="block" src="/dm-complication-check.png"
              >Complication check-up
            </AssetModal>
            <AssetModal class="block" :src="['/dm-drug-consider-1.png', '/dm-drug-consider-2.png']"
              >Drug considerations
            </AssetModal>
            <AssetModal class="block" :src="['/dm-drug-approach-1.png', '/dm-drug-approach-2.png']"
              >Approach to hypoglycemic agents
            </AssetModal>
            <AssetModal class="block" src="/dm-drug-ckd.png"
              >Drug dosage adjustment for CKD patients
            </AssetModal>
          </template>
        </template>
        <template #form>
          <div class="col-span-6">
            <div class="relative flex gap-x-3 items-center">
              <div class="flex items-center">
                <input
                  id="dx_diabetes"
                  v-model="form.dx_diabetes"
                  type="checkbox"
                  class="size-6 rounded border-gray-300 text-black focus:ring-black"
                />
              </div>
              <div class="text-lg">
                <label for="dx_diabetes" class="font-medium">Diabetes mellitus</label>
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <Label for="hba1c" value="HbA1c (%)" />
            <Input id="hba1c" v-model="form.hba1c" type="number" class="mt-1 w-full" />
          </div>
          <div class="col-span-1">
            <Label for="hba1c_when" value="Measured at" />
            <Input
              id="hba1c_when"
              v-model="form.hba1c_when"
              type="text"
              class="mt-1 w-full"
              placeholder="MM/YY"
            />
          </div>
          <div class="col-span-2">
            <Label for="fasting_glucose" value="Fasting glucose (mg%)" />
            <Input
              id="fasting_glucose"
              v-model="form.fasting_glucose"
              type="number"
              class="mt-1 w-full"
            />
          </div>
          <div class="col-span-1">
            <Label for="fasting_glucose_when" value="Measured at" />
            <Input
              id="fasting_glucose_when"
              v-model="form.fasting_glucose_when"
              type="text"
              class="mt-1 w-full"
              placeholder="MM/YY"
            />
          </div>
          <div v-if="form.dx_diabetes" class="col-span-6 relative flex gap-x-3 items-center">
            <div class="flex h-6 items-center">
              <input
                id="hypoglycemic_symptoms"
                v-model="form.hypoglycemic_symptoms"
                type="checkbox"
                class="size-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
              />
            </div>
            <div class="text-sm/6">
              <label for="hypoglycemic_symptoms" class="font-medium text-gray-900"
                >Hypoglycemic symptoms: hunger/sweating/palpitation</label
              >
            </div>
          </div>
          <div class="col-span-full">
            <textarea
              rows="2"
              placeholder="Note"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
              v-model="form.note_diabetes"
            ></textarea>
          </div>
          <template v-if="form.dx_diabetes">
            <div class="col-span-6">
              <span class="underline">Medications</span>
            </div>
            <div class="col-span-6">
              <table class="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Drug
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Dosage
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                    >
                      Previous (mg/day)
                    </th>
                    <th
                      scope="col"
                      class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
                      @click="
                        diabetes_drugs = diabetes_drugs.map((drug) => ({
                          ...drug,
                          new_dose: drug.previous_dose,
                        }))
                      "
                    >
                      New (mg/day)
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="drug in diabetes_drugs" :key="drug.name">
                    <td class="px-2 py-1 text-center">
                      <input
                        disabled
                        :checked="drug.previous_dose != '' || drug.new_dose != ''"
                        type="checkbox"
                        class="size-4 rounded border-gray-300 text-green-600"
                      />
                    </td>
                    <td class="px-2 py-1">
                      <span
                        v-if="drug.group"
                        class="px-0.5 mr-0.5 text-xs text-gray-400 outline outline-1 outline-gray-400 rounded"
                        >{{ drug.group }}</span
                      >
                      {{ drug.name }}
                      <span v-if="drug.trade_name" class="mx-0.5">({{ drug.trade_name }})</span>
                      <span class="text-xs text-gray-400">{{ drug.description }}</span>
                    </td>
                    <td class="px-2 py-1 text-xs text-gray-400">
                      {{ drug.dosage }}
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.previous_dose" type="number" class="h-8 max-w-28" />
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="drug.new_dose" type="number" class="h-8 max-w-28" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Screening for complications</template>
        <template #form>
          <div class="col-span-6">
            <table class="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    When (MM/YY)
                  </th>
                  <th
                    scope="col"
                    class="px-2 pb-1 text-left text-xs font-medium text-gray-500 tracking-wider cursor-pointer"
                  >
                    Result
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="item in investigations" :key="item.name">
                  <tr v-if="item.ask_history">
                    <td class="px-2 py-1">
                      {{ item.name }}
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="item.when" type="text" class="h-8 max-w-28" />
                    </td>
                    <td class="px-2 py-1">
                      <Input v-model="item.result" type="text" class="h-8 w-full" />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Lifestyle modifications</template>
        <template #form>
          <div v-for="item in lifestyle_modifications" class="col-span-6">
            <div class="relative flex gap-x-3 items-center">
              <div class="flex items-center">
                <input
                  :id="item.id"
                  v-model="item.checked"
                  type="checkbox"
                  class="size-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                />
              </div>
              <div class="text-sm/6">
                <label :for="item.id" class="font-medium">
                  <span
                    v-if="item.for"
                    class="px-0.5 mr-1 text-xs text-gray-400 outline outline-1 outline-gray-400 rounded"
                    >{{ item.for }}</span
                  >{{ item.title }}</label
                >
                <p class="text-gray-500">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>Investigations</template>
        <template #form>
          <div class="col-span-6">
            <div v-for="(item, i) in investigations">
              <div class="relative flex gap-x-3 items-center">
                <div class="flex items-center">
                  <input
                    :id="'investigation-' + i"
                    v-model="item.checked"
                    type="checkbox"
                    class="size-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                  />
                </div>
                <div class="text-sm/6">
                  <label :for="'investigation-' + i" class="font-medium"> {{ item.name }}</label>
                  <span class="ml-2 text-gray-500">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <!-- Display in text format for copying into EMR program -->
      <FormSection>
        <template #title>
          <span
            class="px-0.5 mr-1 text-sm text-green-600 outline outline-1 outline-green-600 rounded"
            >Export</span
          >
          Progress note
        </template>
        <template #form>
          <div class="col-span-6 font-mono select-all">
            NCDs CARE
            <p v-if="form.age">
              {{ form.sex == '1' ? 'Male' : 'Female' }}, {{ form.age }} years old,
              {{ form.smoking ? 'smoker' : 'non-smoker'
              }}<span v-if="form.height && form.weight"
                >, BMI
                {{ (Number(form.weight) / (Number(form.height) / 100) ** 2).toFixed(2) }}</span
              >
            </p>
            <p>{{ form.note_general }}</p>
            <p v-if="form.feeling_well">The patient is feeling well.</p>
            <p v-if="history.filter((h) => h.checked).length > 0">
              Positive history of
              {{
                history
                  .filter((h) => h.checked)
                  .map((h) => h.title.toLowerCase())
                  .join(', ')
              }}.
            </p>
            <p>
              Denies
              {{
                history
                  .filter(
                    (h) => !h.checked && (form.sex == '0' || h.title != 'Gestational hypertension'),
                  )
                  .map((h) => h.title.toLowerCase())
                  .join(', ')
              }}.
            </p>
            <p>====== {{ form.dx_hypertension ? 'HYPERTENSION' : 'BLOOD PRESSURE' }} ======</p>
            <span v-if="form.office_sbp">
              Office BP: {{ form.office_sbp }}/{{ form.office_dbp }} mmHg&ensp;
            </span>
            <span v-if="form.home_sbp">Home BP: {{ form.home_sbp }}/{{ form.home_dbp }} mmHg</span>
            <span v-else>Home BP not available.</span>
            <template v-if="form.dx_hypertension">
              <p v-if="form.hypotensive_symptoms">Complains of hypotensive symptoms.</p>
              <p v-else>Denies hypotensive symptoms.</p>
              <p class="whitespace-pre-wrap">{{ form.note_hypertension }}</p>
              <div
                v-if="
                  hypertension_drugs.filter((drug) => drug.previous_dose || drug.new_dose).length >
                  0
                "
              >
                Medications:
                <ul>
                  <template v-for="drug in hypertension_drugs">
                    <li v-if="drug.previous_dose || drug.new_dose">
                      - {{ drug.name }}:
                      <span v-if="drug.previous_dose != drug.new_dose">
                        {{ drug.previous_dose || '0' }} -> adjust to
                        {{ drug.new_dose || '0' }}</span
                      ><span v-else>continue {{ drug.previous_dose || '0' }}</span>
                      mg/day
                    </li>
                  </template>
                </ul>
              </div>
              <p v-else>No medication.</p>
            </template>
            <template v-if="form.dx_dyslipidemia">
              <p>==== DYSLIPIDEMIA / ASCVD PREVENTION ====</p>
              <p v-if="form.ldl">
                Last lipid {{ form.lipid_when }}: LDL-C {{ form.ldl }}, TC
                {{ form.total_cholesterol }} mg/dL
              </p>
              <p v-if="cvRisk.includes('%')">{{ cvRisk }}</p>
              <p v-if="form.myopathy">Complains of myalgia.</p>
              <p v-else>Denies myalgia or weakness.</p>
              <p>{{ form.note_dyslipidemia }}</p>
              <p v-if="form.target_ldl">Target LDL: {{ form.target_ldl }}</p>
              <div
                v-if="
                  dyslipidemia_drugs.filter((drug) => drug.previous_dose || drug.new_dose).length >
                  0
                "
              >
                Medications:
                <ul>
                  <template v-for="drug in dyslipidemia_drugs">
                    <li v-if="drug.previous_dose || drug.new_dose">
                      - {{ drug.name }}: {{ drug.previous_dose || '0' }}
                      <span v-if="drug.previous_dose != drug.new_dose">
                        -> adjust to {{ drug.new_dose || '0' }}</span
                      >
                      mg/day
                    </li>
                  </template>
                </ul>
              </div>
              <p v-else>No medication.</p>
            </template>
            <template v-else-if="cvRisk.includes('%')">
              <p>====== ASCVD PREVENTION ======</p>
              <p>{{ cvRisk }}</p>
            </template>
            <template v-if="form.dx_diabetes">
              <p>==== TYPE II DIABETES MELLITUS ====</p>
              <p v-if="form.hba1c">Last HbA1c {{ form.hba1c_when }}: {{ form.hba1c }}%</p>
              <p v-if="form.fasting_glucose">
                Last fasting glucose {{ form.fasting_glucose_when }}: {{ form.fasting_glucose }} mg%
              </p>
              <p v-if="form.hypoglycemic_symptoms">Complains of hypoglycemic symptoms.</p>
              <p v-else>Denies hypoglycemic symptoms.</p>
              <p>{{ form.note_diabetes }}</p>
              <div
                v-if="
                  diabetes_drugs.filter((drug) => drug.previous_dose || drug.new_dose).length > 0
                "
              >
                Medications:
                <ul>
                  <template v-for="drug in diabetes_drugs">
                    <li v-if="drug.previous_dose || drug.new_dose">
                      - {{ drug.name }}: {{ drug.previous_dose || '0' }}
                      <span v-if="drug.previous_dose != drug.new_dose">
                        -> adjust to {{ drug.new_dose || '0' }}</span
                      >
                      mg/day
                    </li>
                  </template>
                </ul>
              </div>
              <p v-else>No medication.</p>
            </template>
            <template v-else-if="form.fasting_glucose || form.hba1c">
              <p>====== GLUCOSE SCREENING ======</p>
              <p v-if="form.hba1c">Last HbA1c {{ form.hba1c_when }}: {{ form.hba1c }}%</p>
              <p v-if="form.fasting_glucose">
                Last fasting glucose {{ form.fasting_glucose_when }}: {{ form.fasting_glucose }} mg%
              </p>
              <p>{{ form.note_diabetes }}</p>
            </template>
            <template v-if="investigations.filter((i) => i.result).length > 0">
              <p>===== COMPLICATION SCREENING =====</p>
              <ul>
                <template v-for="item in investigations">
                  <li v-if="item.result">- {{ item.name }}: {{ item.result }} ({{ item.when }})</li>
                </template>
              </ul>
            </template>
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>
          <span
            class="px-0.5 mr-1 text-sm text-green-600 outline outline-1 outline-green-600 rounded"
            >Export</span
          >
          Physical examination
        </template>
        <template #form>
          <div class="col-span-6 font-mono select-all">
            (General): good consciousness{{ form.feeling_well ? ', looks well' : '' }}, no
            jaundice<br />
            (Cardio): full and regular pulse<br />
            (Extremities): no rash, no deformity, no edema
          </div>
        </template>
      </FormSection>
      <SectionBorder />
      <FormSection>
        <template #title>
          <span
            class="px-0.5 mr-1 text-sm text-green-600 outline outline-1 outline-green-600 rounded"
            >Export</span
          >
          Advice
        </template>
        <template #form>
          <div class="col-span-6 font-mono select-all">
            <template v-if="lifestyle_modifications.filter((item) => item.checked).length > 0">
              <p>Advise lifestyle modifications:</p>
              <ul>
                <template v-for="item in lifestyle_modifications">
                  <li v-if="item.checked">- {{ item.title }}</li>
                </template>
              </ul>
              <br />
            </template>
            <template v-if="investigations.filter((item) => item.checked).length > 0">
              <p>Lab next visit:</p>
              <ul>
                <template v-for="item in investigations">
                  <li v-if="item.checked">- {{ item.name }}</li>
                </template>
              </ul>
              <br />
            </template>
            <p v-if="form.home_sbp">- Home BP measurement 1 week before next visit</p>
            <p v-if="form.dx_hypertension">- Advise observe hypotensive symptoms</p>
            <p v-if="form.dx_diabetes">- Advise observe hypoglycemic symptoms</p>
            <p>- F/U OPD Med</p>
          </div>
        </template>
      </FormSection>
    </div>
  </main>
</template>
