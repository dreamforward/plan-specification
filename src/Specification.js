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
        catchUp: user.CatchUp || '-',
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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Compensation</th>
            <th>Employee Deferral</th>
            <th>Employer Contribution</th>
            <th>Employer Match</th>
            <th>Profit Sharing</th>
            <th>Catch-up Contribution</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {processed.map((user, idx) => {
            return <tr key={idx}>
              <td>{user.name}</td>
              <td>{getMoneyDisplay(user.salary)}</td>
              <td>{getMoneyDisplay(user.deferral)}</td>
              <td>{getMoneyDisplay(user.employerContrib)}</td>
              <td>{getMoneyDisplay(user.employerMatch)}</td>
              <td>{getMoneyDisplay(user.profitSharing)}</td>
              <td>{getMoneyDisplay(user.catchUp)}</td>
              <td>{getMoneyDisplay(user.total)}</td>
            </tr>
          })}
          <tr className='totals'>
            <td>Totals</td>
            <td>{getMoneyDisplay(summation('salary'))}</td>
            <td>{getMoneyDisplay(summation('deferral'))}</td>
            <td>{getMoneyDisplay(summation('employerContrib'))}</td>
            <td>{getMoneyDisplay(summation('employerMatch'))}</td>
            <td>{getMoneyDisplay(summation('profitSharing'))}</td>
            <td>{getMoneyDisplay(summation('catchUp'))}</td>
            <td>{getMoneyDisplay(summation('total'))}</td>
          </tr>
        </tbody>
      </table>
      <dl>
        <dt>Employer Tax Bracket</dt>
        <dd>{this.props.assumptions.employerTaxPercent}%</dd>
        <dt>Gross Outlay by employer</dt>
        <dd>{getMoneyDisplay(grossOutlayByEmployer)}</dd>
        <dt>Less Tax Savings*</dt>
        <dd>{getMoneyDisplay(lessTaxSavings)}</dd>
        <dt>Annual Administrative Fee**</dt>
        <dd>{getMoneyDisplay(adminFee)}</dd>
        <dt>Total Cost</dt>
        <dd>{getMoneyDisplay(total)}</dd>
      </dl>
      <small>*Tax savings are for illustrative purposes only</small>
      <br />
      <small>**Administrative fees are projected based on current data and should not be considered final till time of contracting</small>
    </div>
  }
}

export default Specification
