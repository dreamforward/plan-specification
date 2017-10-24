import moment from 'moment'
import accounting from 'accounting'

export const getMoneyDisplay = (amount) => {
  if (!amount) {
    return '-'
  }
  if (typeof amount !== 'number') {
    return amount
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

export const getAge = (user) => {
  const age = moment(user.DOB, 'M/D/YYYY')
  if (!age.isValid()) {
    return 'N/A'
  }
  return moment().diff(age, 'years')
}

export const getEligibility = (user, assumptions) => {
  const doh = moment(user.DOH, 'M/D/YYYY')
  if (!doh.isValid()) {
    return true
  }
  return doh.add(assumptions.minimumMonthsOfService, 'months').isBefore(moment())
}
