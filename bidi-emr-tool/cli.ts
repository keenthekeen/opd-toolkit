import type { Args } from 'https://deno.land/std@0.200.0/flags/mod.ts'
import { parse } from 'https://deno.land/std@0.200.0/flags/mod.ts'
import { fetchEmr } from "./emr-connect.ts"

async function main(inputArgs: string[]): Promise<void> {
  let patientId: string | null = null
  let sessionId: string | null = null
  if (inputArgs) {
    const args = parseArguments(inputArgs)
    patientId = args.patientId
    sessionId = args.sessionId
  }
  if (!patientId) {
    patientId = prompt('Patient Id?')
  }
  if (!sessionId) {
    sessionId = prompt('Session Id?')
  }
  if (!patientId || !sessionId) {
    console.error('Patient Id and Session Id are required')
    return
  }

  const allResult = await fetchEmr(sessionId, patientId)
  console.log(allResult)

  console.log(`%cHello, ${allResult.name}!`, `color: blue; font-weight: bold`)
}

function parseArguments(args: string[]): Args {
  return parse(args, {
    // List of aliases
    alias: { patientId: 'id', sessionId: 's' },
    // All boolean arguments
    boolean: [],
    // All string arguments
    string: ['patientId', 'sessionId'],
    stopEarly: false,
    '--': true,
  })
}

await main(Deno.args)
