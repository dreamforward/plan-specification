import React, { Component } from 'react'
import {
  getEligibility,
  getDeferral,
  getEmployerContrib,
  getProfitSharing,
  getEmployerMatch,
  getTotal,
  getMoneyDisplay
} from './utilities'
import './table.css'

class Specification extends Component {
  render () {
    const processed = this.props.users.map((user) => {
      return {
        name: `${user.First} ${user.Last}`,
        salary: user.Salary,
        deferral: getDeferral(user, {
          employeeDeferral: this.props.assumptions.employeeDeferral,
          assumptions: this.props.assumptions
        }),
        employerContrib: getEmployerContrib(user, {
          safeHarbor: this.props.safeHarbor,
          assumptions: this.props.assumptions
        }),
        employerMatch: getEmployerMatch(user, {
          match: this.props.match,
          assumptions: this.props.assumptions
        }),
        profitSharing: getProfitSharing(user, {
          profitSharing: this.props.profitSharing,
          assumptions: this.props.assumptions
        }),
        eligibility: getEligibility(user, this.props.assumptions) ? 'Eligible' : 'NOT Eligible',
        catchUp: user.CatchUp,
        total: getTotal(user, {
          match: this.props.match,
          profitSharing: this.props.profitSharing,
          safeHarbor: this.props.safeHarbor,
          employeeDeferral: this.props.assumptions.employeeDeferral,
          assumptions: this.props.assumptions
        })
      }
    })

    const summation = (prop) => {
      return processed.reduce((sum, user) => {
        if (typeof user[prop] === 'number' && user[prop]) {
          sum += user[prop]
        }
        return sum
      }, 0)
    }

    const grossOutlayByEmployer = summation('employerContrib') + summation('employerMatch') + summation('profitSharing')
    const lessTaxSavings = grossOutlayByEmployer * this.props.assumptions.employerTaxPercent
    const adminFee = this.props.assumptions.adminFee + this.props.users.filter(user => getEligibility(user, this.props.assumptions)).length * this.props.assumptions.perEmployeeFee
    const total = grossOutlayByEmployer - lessTaxSavings + adminFee

    return <div>
      <h1>Plan Specifications - {this.props.title}</h1>
      <table className='table table-hover table-bordered'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Comp.</th>
            <th>Employee<br />Deferral</th>
            <th>Employer<br />Contrib.</th>
            <th>Employer<br />Match</th>
            <th>Profit<br />Sharing</th>
            <th>Catch-up<br />Contrib.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {processed.map((user, idx) => {
            return <tr key={idx}>
              <td className='userName'>{user.name}</td>
              <td className='money'>{getMoneyDisplay(user.salary)}</td>
              <td className='money'>{getMoneyDisplay(user.deferral)}</td>
              <td className='money'>{getMoneyDisplay(user.employerContrib, this.props.safeHarbor ? 'missing' : undefined)}</td>
              <td className='money'>{getMoneyDisplay(user.employerMatch)}</td>
              <td className='money'>{getMoneyDisplay(user.profitSharing)}</td>
              <td className='money'>{getMoneyDisplay(user.catchUp)}</td>
              <td className='money'>{getMoneyDisplay(user.total)}</td>
            </tr>
          })}
          <tr className='totals'>
            <th>Totals</th>
            <th className='money'>{getMoneyDisplay(summation('salary'))}</th>
            <th className='money'>{getMoneyDisplay(summation('deferral'))}</th>
            <th className='money'>{getMoneyDisplay(summation('employerContrib'))}</th>
            <th className='money'>{getMoneyDisplay(summation('employerMatch'))}</th>
            <th className='money'>{getMoneyDisplay(summation('profitSharing'))}</th>
            <th className='money'>{getMoneyDisplay(summation('catchUp'))}</th>
            <th className='money'>{getMoneyDisplay(summation('total'))}</th>
          </tr>
        </tbody>
      </table>
      <dl>
        <dt>Employer Tax Bracket:</dt>
        <dd>{this.props.assumptions.employerTaxPercent}%</dd>
        <dt>Gross Outlay by employer:</dt>
        <dd>{getMoneyDisplay(grossOutlayByEmployer)}</dd>
        <dt>Less Tax Savings:</dt>
        <dd>{getMoneyDisplay(lessTaxSavings)}<small>*</small></dd>
        <dt>Annual Administrative Fee:</dt>
        <dd>{getMoneyDisplay(adminFee)}<small>**</small></dd>
        <dt>Total Cost:</dt>
        <dd>{getMoneyDisplay(total)}</dd>
      </dl>
      <small>*Tax savings are for illustrative purposes only</small>
      <br />
      <small>**Administrative fees are projected based on current data and should not be considered final until time of contracting</small>
    </div>
  }
}

export default Specification
