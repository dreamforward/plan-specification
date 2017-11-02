import moment from 'moment'
import accounting from 'accounting'

export const getMoneyDisplay = (amount, override) => {
  if (!amount) {
    return override || '-'
  }
  if (typeof amount !== 'number') {
    return override || amount
  }
  return accounting.formatMoney(amount, '$', 0)
}

export const getTotal = (user, {
  employeeDeferral,
  safeHarbor,
  match,
  profitSharing,
  assumptions
}) => {
  return [
    getDeferral(user, {employeeDeferral, assumptions}),
    getEmployerContrib(user, {safeHarbor, assumptions}),
    getEmployerMatch(user, {match, assumptions}),
    getProfitSharing(user, {profitSharing, assumptions}),
    user.CatchUp
  ]
    .reduce((summation, val) => {
      if (typeof val === 'number' && val) {
        summation += val
      }
      return summation
    }, 0)
}

export const getDeferral = (user, {employeeDeferral, assumptions}) => {
  if (!getEligibility(user, assumptions)) {
    return 'Not eligible'
  }
  if (user.Deferral) {
    return user.Deferral
  }
  return user.Salary * employeeDeferral
}

export const getEmployerContrib = (user, {safeHarbor, assumptions}) => {
  if (!getEligibility(user, assumptions)) {
    return 'Not eligible'
  }
  return user.Salary * safeHarbor
}

export const getEmployerMatch = (user, {match, assumptions}) => {
  if (!getEligibility(user, assumptions)) {
    return 'Not eligible'
  }
  return user.Salary * match
}

export const getProfitSharing = (user, {profitSharing, assumptions}) => {
  if (!getEligibility(user, assumptions)) {
    return 'Not eligible'
  }
  if (profitSharing && user.ProfitSharing) {
    return user.ProfitSharing
  }
  return profitSharing
}

export const getAge = (user, fromDate) => {
  fromDate = fromDate || moment()
  const age = moment(user.DOB, 'M/D/YYYY')
  if (!age.isValid()) {
    return 'N/A'
  }
  return moment(fromDate).diff(age, 'years')
}

export const getEligibility = (user, assumptions) => {
  const effectiveDate = moment(assumptions.effectiveDate, 'MM/DD/YYYY')
  const doh = moment(user.DOH, 'M/D/YYYY')
  if (!doh.isValid()) {
    return true
  }
  if (getAge(user, effectiveDate) < assumptions.minimumAge) {
    return false
  }

  return doh.add(assumptions.minimumMonthsOfService, 'months').isBefore(effectiveDate)
}

export const getDateOfEligibility = (user, {assumptions}) => {
  const doh = moment(user.DOH, 'M/D/YYYY')
  if (!doh.isValid()) {
    return user.DOH
  }
  return doh.add(assumptions.minimumMonthsOfService, 'months')
}

export const normalizeNumber = (number) => {
  return accounting.unformat(number)
}
