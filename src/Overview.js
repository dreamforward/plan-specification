import React, { Component } from 'react'
import { getDeferral, getMoneyDisplay, getEmployerMatch, getProfitSharing } from './utilities'

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

    return <div>
      <dl>
        <dt>Effective Date (for model:</dt>
        <dd>{this.props.assumptions.effectiveDate}</dd>
        <dt>Normal Retirement Age</dt>
        <dd>{this.props.assumptions.retirementAge}</dd>
        <dt>Assumptions:</dt>
        <dd>
          <ul>
            <li>
              Employee 401k contribution rates: {this.props.assumptions.employeeDeferral}%
            </li>
            <li>
              Employer match (for relevant plans): {this.props.assumptions.employerMatch}%
            </li>
            <li>Owners max out contributions</li>
            <li>Employee contributions are considered holistically vs Roth/traditional</li>
          </ul>
        </dd>
        <dt>Business Entity Type</dt>
        <dd>{this.props.assumptions.businessType}</dd>
        <dt>Eligibility Requirements</dt>
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
        <dt>Vesting Schedule</dt>
        <dd>
          <ul>
            <li>Roth 401k: {this.props.assumptions.rothVestingMonths}</li>
            <li>Traditional 401k: {this.props.assumptions.traditionalVestingMonths}</li>
          </ul>
        </dd>
        <dt>Deferral Contributions</dt>
        <dd>{getMoneyDisplay(deferralContributions)}</dd>
        <dt>Employer Contributions:</dt>
        <dd>
          <ul>
            <li>No Match: $0.0</li>
            {standardMatch}
            {profitSharing}
          </ul>
        </dd>
        <dt>Fee Against Plan Assets</dt>
        <dd>{this.props.assumptions.feeAgainstPlanAssets}</dd>
      </dl>
    </div>
  }
}

export default Overview
