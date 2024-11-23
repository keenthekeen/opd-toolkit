import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import { oakCors } from 'https://deno.land/x/cors/mod.ts'
import { fetchEmr } from './emr-connect.ts'

// Set sessionId
const globalSessionId = prompt('Session Id? (run javascript:document.write(document.cookie))')
if (!globalSessionId) {
  console.error('Session Id is required.')
}

const router = new Router()
router.get('/fetch-emr', async (context) => {
  const url = new URL(context.request.url)

  const patientId = url.searchParams.get('patientId')
  const sessionId = url.searchParams.get('sessionId') ?? globalSessionId
  if (!patientId || !sessionId) {
    context.response.status = 400
    context.response.body = { error: 'Patient Id and Session Id are required' }
    return
  }
  console.log('Fetching EMR for patientId: ', patientId)
  const result = await fetchEmr(patientId, sessionId)
  console.log(result)
  context.response.body = result
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
