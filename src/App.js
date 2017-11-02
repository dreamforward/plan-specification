import React, { Component } from 'react'
import './App.css'
import parser from 'papaparse'
import Overview from './Overview'
import Employees from './Employees'
import Specification from './Specification'
import dfLogo from './images/df-horizontal.svg'
import dfWatermark from './images/df-watermark.svg'
import brookstoneLogo from './images/brookstone-horizontal.png'
import brookstoneWatermark from './images/brookstone-watermark.png'
import { normalizeNumber } from './utilities'

class App extends Component {
  constructor () {
    super()
    const searchParams = window.location.search
      .substring(1)
      .split('&')
      .reduce((input, str) => {
        const parts = str.split('=')
        input[parts[0]] = decodeURIComponent(parts[1])
        return input
      }, {})
    if (searchParams.i) {
      let planInfo = JSON.parse(window.atob(searchParams.i))
      const parsed = parser.parse(planInfo.csv, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      })
      this.state = {
        users: parsed.data
          .map((user) => {
            ['Salary', 'ProfitSharing', 'CatchUp', 'Deferral']
              .forEach((key) => {
                if (user[key]) {
                  user[key] = normalizeNumber(user[key])
                }
              })
            return user
          }),
        assumptions: planInfo.assumptions
      }
    } else {
      this.state = {
        users: []
      }
    }
  }
  render () {
    console.log(this.state.assumptions)
    if (!this.state.users.length) {
      let helper
      if (process.env.NODE_ENV !== 'production') {
        helper = <a href='/?i=eyJjc3YiOiJMYXN0LEZpcnN0LERPQixET0gsRE9FLFNhbGFyeSxEZWZlcnJhbCxDYXRjaFVwXG5XZWxscyxEb3VnLE4vQSxPV05FUixOL0EsTi9BLDE4MDAwLDYwMDBcbldoaXRlaGVhZCxKYXNvbixOL0EsT1dORVIsTi9BLE4vQSwxODAwMCw2MDAwXG5CYXVsaXN0YSxFZGdvciwzLzE0LzE5ODAsMy8yMC8yMDE3LDkvMTYvMjAxNyw0MzY4MFxuSmFjb2JzLFJheW11bmRvLDYvMjAvMTk4MiwzLzIwLzIwMTcsOS8xNi8yMDE3LDQzNjgwXG5CYXNzLEplcmVteSwyLzE2LzE5OTEsOC8yNC8yMDE2LDIvMjAvMjAxNyw0MTYwMFxuUGFya2VyLEJhcnJldHQsMTAvMTAvMTk4OCw1LzIxLzIwMTMsMTEvMTcvMjAxMyw0MTYwMFxuTmV3Y29tYixEYWxlLDUvMTYvMTk2NSwxMi8xNC8yMDE0LDYvMTIvMjAxNSwzOTUyMFxuVGF5bG9yLEdlbmUsMS81LzE5NjQsMTAvMzEvMjAxNCw0LzI5LzIwMTUsMzk1MjBcbkpvaG5zb24sUkcsMTAvMjMvMTk4OSwzLzI0LzIwMTcsOS8yMC8yMDE3LDM4NDgwXG5QZXJhbGVzLEpvc2UsMy82LzE5ODksMTAvMjkvMjAxNSw0LzI2LzIwMTYsMzc0NDBcblBlcmFsZXMsVmFsZW50aW4sNS8yMi8xOTgxLDcvMjMvMjAxNSwxLzE5LzIwMTYsMzc0NDBcblJpbGV5LExpc2EsNi8xOC8xOTY3LDUvMS8yMDEzLDEwLzI4LzIwMTMsMzUzNjBcbk1lZGluYSxSaWNreSw3LzEzLzE5ODksMTIvMTYvMjAxNiw2LzE0LzIwMTcsMzMyODBcblNhbGF6b3IsTWVsZXNpbyw1LzIyLzE5ODAsOS8xNi8yMDE1LDMvMTQvMjAxNiwzMzI4MFxuV2lsbGlhbXMsVGVycnksOC8xNy8xOTcwLDYvMTUvMjAxNSwxMi8xMi8yMDE1LDMzMjgwXG5FZHdhcmRzLER1c3Rpbiw2LzgvMTk5NCwxLzIzLzIwMTQsNy8yMi8yMDE0LDMxMjAwXG5XZWxscyxNYXR0LDgvMTAvMTk5NiwyLzE1LzIwMTYsOC8xMy8yMDE2LDMxMjAwXG5KdXJnb3ZhbixXaWxsaWFtLDcvMjcvMTk5MCw4LzI0LzIwMTYsMi8yMC8yMDE3LDI5MTIwXG5NYW5uaW5nLEJ1Y2ssNC84LzE5ODEsMy8xNy8yMDE3LDkvMTMvMjAxNywyNzA0MFxuIiwiYXNzdW1wdGlvbnMiOnsiYnVzaW5lc3NUeXBlIjoiQy1Db3JwIiwiZWZmZWN0aXZlRGF0ZSI6IjAxLzAxLzIwMTgiLCJ0ZW1wbGF0ZSI6ImRyZWFtIGZvcndhcmQiLCJyZXRpcmVtZW50QWdlIjo2NywibWluaW11bU1vbnRoc09mU2VydmljZSI6NiwidHJhZGl0aW9uYWxWZXN0aW5nTW9udGhzIjowLCJyb3RoVmVzdGluZ01vbnRocyI6MCwibWluaW11bUFnZSI6MjEsImVtcGxveWVlRGVmZXJyYWwiOjAuMDUsImVtcGxveWVyQ29udHJpYnV0aW9uIjowLjAzLCJlbXBsb3llck1hdGNoIjowLjAzLCJwcm9maXRTaGFyaW5nIjoxMDAwLCJhZG1pbkZlZSI6MjUwMCwicGVyRW1wbG95ZWVGZWUiOjM2LCJmZWVBZ2FpbnN0UGxhbkFzc2V0cyI6NzUsImVtcGxveWVyVGF4UGVyY2VudCI6MC4yNX19'>LINKY</a>
      }
      return <div>
        Your link is invalid. Please make sure you've copied it in it's entirety properly.
        {helper}
      </div>
    }

    let className = 'showHeader'
    if (this.state.users.length <= 26) {
      className = ''
    }

    let coverPage
    let watermark
    if (this.state.assumptions.template === 'dream forward') {
      watermark = <img className='watermark' src={dfWatermark} alt='dream forward logo' />
      coverPage = <div className='page'>
        <div className='coverPage'>
          <img className='watermark' src={dfWatermark} alt='dream forward logo' />
          <img className='logo' src={dfLogo} alt='dream forward logo' />
          <h1>401(k) Plan Design</h1>
        </div>
      </div>
    }
    if (this.state.assumptions.template === 'brookstone') {
      watermark = <img className='watermark brookstone' src={brookstoneWatermark} alt='brookstone watermark' />
      coverPage = <div className='page'>
        <div className='coverPage'>
          <img className='watermark brookstone' src={brookstoneWatermark} alt='brookstone logo' />
          <img className='logo brookstone' src={brookstoneLogo} alt='brookstone logo' />
          <h1>401(k) Plan Design</h1>
        </div>
      </div>
    }

    let employerMatch
    if (this.state.assumptions.employerMatch) {
      employerMatch = <div className='page'>
        <img className='watermark' src={dfWatermark} alt='dream forward logo' />
        <Specification
          users={this.state.users}
          assumptions={this.state.assumptions}
          title='Employer Match'
          match={this.state.assumptions.employerMatch}
          profitSharing={0}
          safeHarbor={0}
        />
      </div>
    }

    let profitSharing
    if (this.state.assumptions.profitSharing) {
      profitSharing = <div className='page'>
        {watermark}
        <Specification
          users={this.state.users}
          assumptions={this.state.assumptions}
          title='Profit Sharing'
          match={0}
          profitSharing={this.state.assumptions.profitSharing}
          safeHarbor={0}
        />
      </div>
    }

    let safeHarbor
    if (this.state.assumptions.safeHarborPercent) {
      safeHarbor = <div className='page'>
        {watermark}
        <Specification
          users={this.state.users}
          assumptions={this.state.assumptions}
          title='Safe Harbor'
          match={0}
          profitSharing={0}
          safeHarbor={this.state.assumptions.safeHarborPercent}
        />
      </div>
    }
    return (
      <div className={`main ${className}`}>
        {coverPage}
        <div className='page'>
          {watermark}
          <Overview users={this.state.users} assumptions={this.state.assumptions} />
        </div>
        <div className='page'>
          {watermark}
          <Employees users={this.state.users} assumptions={this.state.assumptions} />
        </div>
        <div className='page'>
          {watermark}
          <Specification
            users={this.state.users}
            assumptions={this.state.assumptions}
            title='No Match'
            match={0}
            profitSharing={0}
            safeHarbor={0}
          />
        </div>
        {employerMatch}
        {profitSharing}
        {safeHarbor}
      </div>
    )
  }
}

export default App
