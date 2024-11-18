// Reference: https://www.rama.mahidol.ac.th/cardio_vascular_risk/thai_cv_risk_score/
const calculateASCVDRisk = (
  age: number,
  smoke: number,
  dm: number,
  sbp: number,
  sex: number,
  tc: number,
  whr?: number,
  wc?: number,
) => {
  let full_score = 0
  let compare_score = 0
  let predicted_risk = 0
  let compare_risk = 0
  const compare_whr = sex == 1 ? 0.58125 : 0.52667
  const compare_wc = sex == 1 ? 93 : 79
  let compare_sbp = 120
  const sur_root = 0.964588
  if (sex == 1 && age > 60) {
    compare_sbp = 132
  } else if (sex == 0 && age <= 60) {
    compare_sbp = 115
  } else if (sex == 0 && age > 60) {
    compare_sbp = 130
  }
  if (age > 1 && sbp >= 70) {
    if (tc > 0) {
      // Use total cholesterol from blood test
      full_score =
        0.08183 * age +
        0.39499 * sex +
        0.02084 * sbp +
        0.69974 * dm +
        0.00212 * tc +
        0.41916 * smoke
      predicted_risk = 1 - Math.pow(sur_root, Math.exp(full_score - 7.04423))
      compare_score = 0.08183 * age + 0.39499 * sex + 0.02084 * compare_sbp + 0.00212 * 200
      compare_risk = 1 - Math.pow(sur_root, Math.exp(compare_score - 7.04423))
    } else if (whr) {
      full_score =
        0.079 * age +
        0.128 * sex +
        0.019350987 * sbp +
        0.58454 * dm +
        3.512566 * whr +
        0.459 * smoke
      predicted_risk = 1 - Math.pow(sur_root, Math.exp(full_score - 7.712325))
      compare_score = 0.079 * age + 0.128 * sex + 0.019350987 * compare_sbp + 3.512566 * compare_whr
      compare_risk = 1 - Math.pow(sur_root, Math.exp(compare_score - 7.712325))
    } else if (wc) {
      full_score =
        0.08372 * age + 0.05988 * sex + 0.02034 * sbp + 0.59953 * dm + 0.01283 * wc + 0.459 * smoke
      predicted_risk = 1 - Math.pow(sur_root, Math.exp(full_score - 7.31047))
      compare_score = 0.08372 * age + 0.05988 * sex + 0.02034 * compare_sbp + 0.01283 * compare_wc
      compare_risk = 1 - Math.pow(sur_root, Math.exp(compare_score - 7.31047))
    }
  }
  return { full_score, predicted_risk, compare_score, compare_risk }
}

export const calculateASCVDRiskToText = (
  age: number,
  smoke: boolean,
  dm: boolean,
  sbp: number,
  sex: number,
  tc: number,
) => {
  if (!age || !sbp || !tc) {
    return 'Please fill in all the required fields to calculate CV risk.'
  }
  age = Math.min(70, age)
  sbp = Math.min(220, sbp)
  tc = Math.min(280, tc)
  const result = calculateASCVDRisk(age, smoke ? 1 : 0, dm ? 1 : 0, sbp, sex, tc)

  const risk = result.predicted_risk > 0.3 ? '>30' : (result.predicted_risk * 100).toFixed(2)
  let riskCategory = 'Low'
  if (result.predicted_risk > 0.3) {
    riskCategory = 'Very High'
  } else if (result.predicted_risk >= 0.2) {
    riskCategory = 'High'
  } else if (result.predicted_risk >= 0.1) {
    riskCategory = 'Medium'
  }
  return (
    '10-year CV risk = ' +
    risk +
    ' %, ' +
    riskCategory +
    ' risk, ' +
    (result.predicted_risk / result.compare_risk).toFixed(1) +
    ' times of the reference population.'
  )
}
