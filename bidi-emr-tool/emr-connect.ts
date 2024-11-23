export async function fetchEmr(patientId: string, sessionId: string) {
  const vitalsReport = await fetchFromRemote('http://192.168.254.90/emrbidi/physician/data/hisDiag.php?&loadDate=&visitId=&name=&selectType=vs&empId=&admit=&clinicTitleId=&ckAdmit=&startDate=&stopDate=&orderPage=0&opdCardImageId=&orderDatePage=0', patientId, sessionId)
  // parse: get first string of '<name>BP:113/66 BT:36.2 BW:65 PR:85 RR:18 </name>'
  const vitals = {
    office_sbp: vitalsReport.match(/<bpHigh>(\d+)<\/bpHigh>/)?.[1],
    office_dbp: vitalsReport.match(/<bpLow>(\d+)<\/bpLow>/)?.[1],
    height: vitalsReport.match(/<height>(\d+)<\/height>/)?.[1],
    weight: vitalsReport.match(/<weight>(\d+)<\/weight>/)?.[1],
  }

  /*const labs = {
    '700': 'Glucose',
    '828': 'A1C',
    '705': 'eGFR',
    '727': 'LDL',
    '725': 'Total cholesterol',
    '715': 'Potassium',
  }*/
  let labs: { itemId: string; name: string, date?: string, ordersId?: string }[] = [{
    name: 'Hemoglobin A1C',
    itemId: '13286',
  }, {
    name: 'Glucose',
    itemId: '13139',
  }, {
    name: 'Creatinine',
    itemId: '13170',
  }, {
    name: 'Lipid Profile',
    itemId: '13198',
  }, {
    name: 'CBC',
    itemId: '13247',
  }, {
    name: 'Electrolyte (Na, K, Cl, CO2)',
    itemId: '13186',
  }]
  const labListResponse = await fetchFromRemote('http://192.168.254.90/emrbidi/physician/data/hisDiag.php?loadDate=&visitId=&name=&selectType=lab&empId=&admit=&clinicTitleId=&ckAdmit=&startDate=&stopDate=&orderPage=0&opdCardImageId=&orderDatePage=0', patientId, sessionId)
  labs = labs.map(lab => {
    // Get orderId of each lab
    const match = labListResponse.match(new RegExp(`<date>(\\d+\/\\d+\/\\d\\d\\d\\d)<\/date>.+?<itemId>${lab.itemId}<\/itemId>.+?<ordersId>(\\d+)<\/ordersId>`))
    return {
      ...lab,
      date: match?.[1],
      ordersId: match?.[2],
    }
  })
  const selectedLabIds = labs.map(lab => lab.ordersId).filter(v => v).join(',');
  const labsReport = await fetchFromRemote(`http://192.168.254.90/emrbidi/lab/main/labResultShow.php?copyForm=T&readOnly=true&ordersId=${selectedLabIds}&listVisitId=&eng=T`, patientId, sessionId)
  const labResult = [
    { id: '868', name: 'Hemoglobin', itemId: '13247' },
    { id: '700', name: 'Glucose', itemId: '13139' },
    { id: '828', name: 'HbA1c', itemId: '13286' },
    { id: '702', name: 'Creatinine', itemId: '13170' },
    { id: '705', name: 'eGFR', itemId: '13170' },
    { id: '727', name: 'LDL', itemId: '13198' },
    { id: '725', name: 'Total cholesterol', itemId: '13198' },
    { id: '715', name: 'Potassium', itemId: '13186' },
  ].map(item => {
    const match = labsReport.match(new RegExp(`'${item.id}[', ]+\\)">&nbsp;<\/td>\\s+<td width="50%">[\\w\\d\\s;&\(\)-]+<\/td>\\s+<td width="9%".+">([\\d\.]+)[&< ]+`, "i"))
    return {
      name: item.name,
      result: match?.[1],
      date: labs.find(lab => lab.itemId === item.itemId)?.date,
    }
  })
  let sex = labsReport.match(/Gender : <\/td>\s+<td width="24%">(.+?)</)?.[1];
  switch (sex) {
    case 'ชาย':
      sex = '1';
      break;
    case 'หญิง':
      sex = '0';
      break;
    default:
      sex = '';
  }
  return {
    name: labsReport.match(/Patient Name : <\/td>\s+<td width="54%">(.+?)</)?.[1],
    age: labsReport.match(/Age : (\d+) /)?.[1],
    // Sex is not working
    sex,
    ...vitals,
    labs: labResult,
  }
}

async function fetchFromRemote(url: string, patientId: string, sessionId: string) {
  const response = await fetch(url + `&patientId=${patientId}`, {
    headers: {
      'Cookie': `PHPSESSID=${sessionId}; TestCookie=0`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko'
    }
  });
  // Decode using locale encoding
  const decoder = new TextDecoder('windows-874');
  return decoder.decode(await response.arrayBuffer());
}