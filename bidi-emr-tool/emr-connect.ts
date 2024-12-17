import NCD_STATIC from '../src/ncd.json' with { type: 'json' }
import { parse } from 'https://deno.land/x/xml@6.0.1/mod.ts'

export async function fetchEmr(sessionId: string, patientId?: string, hn?: string) {
  if (!patientId && hn) {
    // Convert HN to patientId
    const patientSearch = await fetchFromRemote(
      `http://192.168.254.90/emrbidi/share/data/jobList.php?hn1=${hn}&hn2=&an1=&an2=&fname=&lname=&servicePointId=&cid=&allPatient=true`,
      '',
      sessionId,
    )
    const hnMatch = patientSearch.match(/<patientId>(\d+)<\/patientId>/)?.[1]
    if (hnMatch) {
      patientId = hnMatch
    }
  }
  if (!patientId) {
    throw new Error('Patient ID is required')
  }
  const vitalsReport = await fetchFromRemote(
    'http://192.168.254.90/emrbidi/physician/data/hisDiag.php?&loadDate=&visitId=&name=&selectType=vs&empId=&admit=&clinicTitleId=&ckAdmit=&startDate=&stopDate=&orderPage=0&opdCardImageId=&orderDatePage=0',
    patientId,
    sessionId,
  )
  // parse: get first string of '<name>BP:113/66 BT:36.2 BW:65 PR:85 RR:18 </name>'
  const vitals = {
    office_sbp: vitalsReport.match(/<bpHigh>(\d+)<\/bpHigh>/)?.[1],
    office_dbp: vitalsReport.match(/<bpLow>(\d+)<\/bpLow>/)?.[1],
    height: vitalsReport.match(/<height>(\d+)<\/height>/)?.[1],
    weight: vitalsReport.match(/<weight>(\d+)<\/weight>/)?.[1],
  }

  // PREVIOUS LABS
  let labs: { itemId: string; name: string; date?: string; ordersId?: string }[] = [
    {
      name: 'Hemoglobin A1C',
      itemId: '13286',
    },
    {
      name: 'Glucose',
      itemId: '13139',
    },
    {
      name: 'Creatinine',
      itemId: '13170',
    },
    {
      name: 'Lipid Profile',
      itemId: '13198',
    },
    {
      name: 'CBC',
      itemId: '13247',
    },
    {
      name: 'Electrolyte (Na, K, Cl, CO2)',
      itemId: '13186',
    },
  ]
  const labListResponse = await fetchFromRemote(
    'http://192.168.254.90/emrbidi/physician/data/hisDiag.php?loadDate=&visitId=&name=&selectType=lab&empId=&admit=&clinicTitleId=&ckAdmit=&startDate=&stopDate=&orderPage=0&opdCardImageId=&orderDatePage=0',
    patientId,
    sessionId,
  )
  labs = labs.map((lab) => {
    // Get orderId of each lab
    const match = labListResponse.match(
      new RegExp(
        `<date>(\\d+\/\\d+\/\\d\\d\\d\\d)<\/date>.+?<itemId>${lab.itemId}<\/itemId>.+?<ordersId>(\\d+)<\/ordersId>`,
      ),
    )
    return {
      ...lab,
      date: match?.[1],
      ordersId: match?.[2],
    }
  })
  const selectedLabIds = labs
    .map((lab) => lab.ordersId)
    .filter((v) => v)
    .join(',')
  const labsReport = await fetchFromRemote(
    `http://192.168.254.90/emrbidi/lab/main/labResultShow.php?copyForm=T&readOnly=true&ordersId=${selectedLabIds}&listVisitId=&eng=T`,
    patientId,
    sessionId,
  )
  let labResult = [
    { id: '868', name: 'Hemoglobin', itemId: '13247' },
    { id: '700', name: 'Glucose', itemId: '13139' },
    { id: '828', name: 'HbA1c', itemId: '13286' },
    { id: '702', name: 'Creatinine', itemId: '13170' },
    { id: '705', name: 'eGFR', itemId: '13170' },
    { id: '727', name: 'LDL', itemId: '13198' },
    { id: '725', name: 'Total cholesterol', itemId: '13198' },
    { id: '715', name: 'Potassium', itemId: '13186' },
    { id: '723', name: 'AST', itemId: '13199' },
    { id: '724', name: 'ALT', itemId: '13199' },
  ].map((item) => {
    const match = labsReport.match(
      new RegExp(
        `'${item.id}[', ]+\\)">&nbsp;<\/td>\\s+<td width="50%">[\\w\\d\\s;&\(\)-]+<\/td>\\s+<td width="9%".+">([\\d\.]+)[&< ]+`,
        'i',
      ),
    )
    return {
      id: item.id,
      name: item.name,
      result: match?.[1],
      date: labs.find((lab) => lab.itemId === item.itemId)?.date,
    }
  })

  // TODAY LABS
  let todayLabResponse = await fetchFromRemote(
    'http://192.168.254.90/emrbidi/lab/main/labResultShow.php?showTab=T',
    patientId,
    sessionId,
  )
  todayLabResponse = todayLabResponse?.substring(3500, todayLabResponse.length - 4500)
  labResult = labResult.map((item) => {
    const match = todayLabResponse.match(
      new RegExp(`'${item.id}'(?:.|\\s)+?txtBody\\w*?">((?:\\d|\\.)+)<\\/td>`, 'i'),
    )
    console.log(match?.[1])
    return match?.[1]
      ? {
          ...item,
          result: match?.[1],
          date: 'today',
          previous_result: item.result,
          previous_date: item.date,
        }
      : item
  })

  // DRUG ORDERS
  const drugOrderResponse = await fetchFromRemote(
    'http://192.168.254.90/emrbidi/physician/data/hisDiag.php?loadDate=&visitId=&name=&selectType=drug&empId=&admit=&clinicTitleId=&ckAdmit=&startDate=&stopDate=&orderPage=0&opdCardImageId=&orderDatePage=0',
    patientId,
    sessionId,
  )
  const drugOrders = (
    parse(drugOrderResponse).root as {
      data: Drug[]
    }
  ).data.reduce((carry: { code: string; result: string }[], drug: Drug) => {
    if (drug.code && carry.filter((v) => v.code === drug.code).length === 0) {
      // Only unique items
      const drugLabel = drug.drugLabel?.replace(/[\n\r\t]/gm, '') // remove line break
      const amount = parseInt(drug.amount)
      const price = parseInt(drug.price)
      return [
        ...carry,
        {
          code: drug.code,
          date: drug.dateOrder,
          result: `${drug.code} ${drug.name}\n${drug.dateOrder} ${drugLabel}; ${amount}x ${price}B`,
        },
      ]
    }
    return carry
  }, [])

  // VACCINES
  const vaccinesResponse = await fetchFromRemote(
    'http://192.168.254.90/emrbidi/physician/main/opdVaccineHistory.php?a',
    patientId,
    sessionId,
  )
  const vaccinesList = NCD_STATIC.vaccines
    .map((drug) => {
      if (!drug.emr_code) {
        return null
      }
      for (const code of drug.emr_code) {
        const match = vaccinesResponse.includes('>' + code) // case-sensitive
        if (match) {
          return { code, result: 'Yes' }
        }
      }
      return null
    })
    .filter((v) => v)

  let sex = labsReport.match(/Gender : <\/td>\s+<td width="24%">(.+?)</)?.[1]
  switch (sex) {
    case 'ชาย':
      sex = '1'
      break
    case 'หญิง':
      sex = '0'
      break
    default:
      sex = ''
  }
  return {
    name: labsReport.match(/Patient Name : <\/td>\s+<td width="54%">(.+?)</)?.[1],
    age: labsReport.match(/Age : (\d+) /)?.[1],
    patientId,
    sex,
    ...vitals,
    labs: labResult,
    drugs: [...drugOrders, ...vaccinesList],
  }
}

async function fetchFromRemote(url: string, patientId: string, sessionId: string) {
  const response = await fetch(url + `&patientId=${patientId}`, {
    headers: {
      Cookie: `PHPSESSID=${sessionId}; TestCookie=0`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    },
  })
  // Decode using locale encoding
  const decoder = new TextDecoder('windows-874')
  return decoder.decode(await response.arrayBuffer())
}

interface Drug {
  name: string
  code: string
  amount: string
  price: string
  dateOrder: string
  drugLabel: string
}
