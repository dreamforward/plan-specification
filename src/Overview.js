import React, { Component } from 'react'
import { getDeferral, getMoneyDisplay, getEmployerMatch, getProfitSharing, getEmployerContrib } from './utilities'
import moment from 'moment'

class Overview extends Component {
  render () {
    const deferralContributions = this.props.users.reduce((sum, user) => {
      let deferral = getDeferral(user, {
        employeeDeferral: this.props.assumptions.employeeDeferral,
        assumptions: this.props.assumptions
      })
      if (typeof deferral === 'number' && deferral) {
        sum += deferral
      }
      return sum
    }, 0)

    let standardMatch
    if (this.props.assumptions.employerMatch) {
      const employerMatch = this.props.users.reduce((sum, user) => {
        let match = getEmployerMatch(user, {
          match: this.props.assumptions.employerMatch,
          assumptions: this.props.assumptions
        })
        if (typeof match === 'number' && match) {
          sum += match
        }
        return sum
      }, 0)
      standardMatch = <li>Standard Match: {getMoneyDisplay(employerMatch)}</li>
    }

    let profitSharing
    if (this.props.assumptions.profitSharing) {
      const employerProfitSharing = this.props.users.reduce((sum, user) => {
        let profitShare = getProfitSharing(user, {
          profitSharing: this.props.assumptions.profitSharing,
          assumptions: this.props.assumptions
        })
        if (typeof profitShare === 'number' && profitShare) {
          sum += profitShare
        }
        return sum
      }, 0)
      profitSharing = <li>Profit Sharing: {getMoneyDisplay(employerProfitSharing)}</li>
    }

    let safeHarborMatch
    let safeHarborAssumption
    if (this.props.assumptions.safeHarborPercent) {
      const safeHarborFees = this.props.users.reduce((sum, user) => {
        let profitShare = getEmployerContrib(user, {
          safeHarbor: this.props.assumptions.safeHarborPercent,
          assumptions: this.props.assumptions
        })
        if (typeof profitShare === 'number' && profitShare) {
          sum += profitShare
        }
        return sum
      }, 0)
      safeHarborMatch = <li>Safe Harbor: {getMoneyDisplay(safeHarborFees)}</li>
      safeHarborAssumption = <li>Safe Harbor Match: {this.props.assumptions.safeHarborPercent * 100}%</li>
    }

    return <div>
      <h1>Plan Specifications
      </h1>
      <dl className='overview'>
        <dt>Effective Date (for model):</dt>
        <dd>{moment(this.props.assumptions.effectiveDate, 'M/D/YYYY').format('MMM Do, YYYY')}</dd>
        <dt>Normal Retirement Age:</dt>
        <dd>{this.props.assumptions.retirementAge}</dd>
        <dt>Assumptions:</dt>
        <dd>
          <ul>
            <li>
              Employee 401(k) contribution rates: {this.props.assumptions.employeeDeferral * 100}%
            </li>
            <li>
              Employer match (for relevant plans): {this.props.assumptions.employerMatch * 100}%
            </li>
            <li>
              Profit Sharing (for relevant plans): {getMoneyDisplay(this.props.assumptions.profitSharing)}
            </li>
            {safeHarborAssumption}
            <li>Owners max out contributions</li>
          </ul>
        </dd>
        <dt>Business Entity Type:</dt>
        <dd>{this.props.assumptions.businessType}</dd>
        <dt>Eligibility Requirements:</dt>
        <dd>
          <ul>
            <li>
              Minimum Months of Service: {this.props.assumptions.minimumMonthsOfService}
            </li>
            <li>
              Minimum Age: {this.props.assumptions.minimumAge}
            </li>
            <li>Participants enter the plan the 1st day of the month after establishing eligibility.</li>
          </ul>
        </dd>
        <dt>Vesting Schedule:</dt>
        <dd>
          <ul>
            <li>Roth 401(k): {this.props.assumptions.rothVestingMonths || 'Immediate'}</li>
            <li>Traditional 401(k): {this.props.assumptions.traditionalVestingMonths || 'Immediate'}</li>
          </ul>
        </dd>
        <dt>Deferral Contributions:</dt>
        <dd>{getMoneyDisplay(deferralContributions)}</dd>
        <dt>Employer Contributions:</dt>
        <dd>
          <ul>
            <li>No Match: $0</li>
            {safeHarborMatch}
            {standardMatch}
            {profitSharing}
          </ul>
        </dd>
        <dt>Fee Against Plan Assets:</dt>
        <dd>{this.props.assumptions.feeAgainstPlanAssets} bps</dd>
      </dl>
    </div>
  }
}

export default Overview
