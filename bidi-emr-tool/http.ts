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
