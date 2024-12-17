import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import { oakCors } from 'https://deno.land/x/cors/mod.ts'
import { parse } from 'https://deno.land/std@0.200.0/flags/mod.ts'
import { fetchEmr } from './emr-connect.ts'

// Set sessionId
const args = parse(Deno.args, {
  // List of aliases
  alias: { sessionId: 's' },
  // All boolean arguments
  boolean: [],
  // All string arguments
  string: ['sessionId'],
  stopEarly: false,
  '--': true,
})
const globalSessionId = args.sessionId ?? prompt('Run javascript:document.write(document.cookie) and paste session Id:')
if (!globalSessionId) {
  console.error('Session Id is required.')
}

const router = new Router()
router.get('/fetch-emr', async (context) => {
  const url = new URL(context.request.url)

  const patientId = url.searchParams.get('patientId')
  const hn = url.searchParams.get('hn')
  const sessionId = url.searchParams.get('sessionId') ?? globalSessionId
  if ((!patientId && !hn) || !sessionId) {
    context.response.status = 400
    context.response.body = { error: 'Patient Id and Session Id are required' }
    return
  }
  console.log('Fetching EMR for patientId: ', patientId ?? hn)
  const result = patientId ? await fetchEmr(sessionId, patientId) : await fetchEmr(sessionId, undefined, hn ?? '')
  console.log(result)
  context.response.body = result
  /* context.response.body = {
    name: 'นาย ทดสอบ นามสกุล',
    age: '75',
    sex: '1',
    office_sbp: '95',
    office_dbp: '62',
    height: '159',
    weight: '45',
    labs: [
      { name: 'Hemoglobin', result: '9.3', date: '22/11/2567' },
      { name: 'Glucose', result: '86', date: '22/11/2567' },
      { name: 'HbA1c', result: '6.0', date: '22/11/2567' },
      { name: 'Creatinine', result: '0.98', date: '22/11/2567' },
      { name: 'eGFR', result: '75.11', date: '22/11/2567' },
      { name: 'LDL', result: '37', date: '22/11/2567' },
      { name: 'Total cholesterol', result: '108', date: '22/11/2567' },
      { name: 'Potassium', result: '2.5', date: '24/11/2567' },
    ],
    drugs: [{code: 'ITT', result: 'Yes'}, {code: 'TEN1', result: '2024-10-02 ครั้งละ 1 เม็ด หลังอาหารเช้า; 90x 120.00B'}],
  } */
})

router.get('/lab-chart', async (context) => {
  const url = new URL(context.request.url)
  const patientId = url.searchParams.get('patientId')
  const labCodeId = url.searchParams.get('labCodeId')
  if (!patientId || !labCodeId) {
    context.response.status = 400
    context.response.body = { error: 'patientId and labCodeId are required' }
    return
  }
  console.log('Loading lab chart for patientId: ', patientId, 'labCodeId: ', labCodeId)
  const resp = await fetch(
    `http://192.168.254.90/emrbidi/lab/main/labGraphCmp.php?patientId=${patientId}&labCodeId=${labCodeId}&labCountPerLabGraphCmp=13&curPage=1&pageAll=1`,
    {
      headers: {
        accept: 'image/apng,image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
      },
    },
  )
  context.response.status = resp.status
  context.response.headers.set('Content-Type', resp.headers.get('Content-Type') ?? '')
  context.response.body = await resp.arrayBuffer()
})

const app = new Application()
app.use(
  oakCors({
    origin: ['https://opd-toolkit.keendev.net', 'http://localhost:5173'],
    maxAge: 3600,
  }),
)
app.use(router.routes())

console.info('CORS-enabled web server listening on port 8000.')
console.log('Visit https://opd-toolkit.keendev.net/ncd to use.')
await app.listen({ port: 8000 })
