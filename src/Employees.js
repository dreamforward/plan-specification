import React, { Component } from 'react'
import { getAge, getEligibility } from './utilities'

class Employees extends Component {
  render () {
    const eligibleUsers = this.props.users.filter((user) => {
      return getEligibility(user, this.props.assumptions)
    })
    const getTotalSalary = (users) => {
      return users.reduce((val, user) => {
        if (typeof user.Salary === 'number') {
          val = val + user.Salary
        }
        return val
      }, 0)
    }
    return <div>
      <h1>Employees</h1>
      <table className='table table-hover table-bordered'>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Age</th>
            <th>Date of Hire</th>
            <th>Date of Eligibility</th>
            <th>Compensation</th>
            <th>Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {this.props.users.map((user, idx) => {
            return <tr key={idx}>
              <td>{user.First} {user.Last}</td>
              <td>{user.DOB}</td>
              <td>{getAge(user)}</td>
              <td>{user.DOH}</td>
              <td>{user.DOE}</td>
              <td>{user.Salary}</td>
              <td>{getEligibility(user, this.props.assumptions) ? 'Eligible' : 'NOT Eligible'}</td>
            </tr>
          })}
        </tbody>
      </table>
      <dl>
        <dt>Total Employees</dt>
        <dd>{this.props.users.length}</dd>
        <dt>Eligible Employees</dt>
        <dd>{eligibleUsers.length}</dd>
        <dt>Total Comp</dt>
        <dd>{getTotalSalary(this.props.users)}</dd>
        <dt>Eligible Compensation</dt>
        <dd>{getTotalSalary(eligibleUsers)}</dd>
      </dl>
    </div>
  }
}

export default Employees
