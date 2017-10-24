import React, { Component } from 'react'
import './App.css'
import parser from 'papaparse'
import Overview from './Overview'
import Employees from './Employees'
import Specification from './Specification'

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
        users: parsed.data,
        assumptions: planInfo.assumptions
      }
    } else {
      this.state = {
        users: []
      }
    }
  }
  render () {
    if (!this.state.users.length) {
      let helper
      if (process.env.NODE_ENV !== 'production') {
        helper = <a href='/?i=eyJjc3YiOiJMYXN0LEZpcnN0LERPQixET0gsRE9FLFNhbGFyeSxEZWZlcnJhbCxDYXRjaFVwXG5XZWxscyxEb3VnLE4vQSxPV05FUixOL0EsTi9BLDE4MDAwLDYwMDBcbldoaXRlaGVhZCxKYXNvbixOL0EsT1dORVIsTi9BLE4vQSwxODAwMCw2MDAwXG5CYXVsaXN0YSxFZGdvciwzLzE0LzgwLDMvMjAvMTcsOS8xNi8xNyw0MzY4MFxuSmFjb2JzLFJheW11bmRvLDYvMjAvODIsMy8yMC8xNyw5LzE2LzE3LDQzNjgwXG5CYXNzLEplcmVteSwyLzE2LzkxLDgvMjQvMTYsMi8yMC8xNyw0MTYwMFxuUGFya2VyLEJhcnJldHQsMTAvMTAvODgsNS8yMS8xMywxMS8xNy8xMyw0MTYwMFxuTmV3Y29tYixEYWxlLDUvMTYvNjUsMTIvMTQvMTQsNi8xMi8xNSwzOTUyMFxuVGF5bG9yLEdlbmUsMS81LzY0LDEwLzMxLzE0LDQvMjkvMTUsMzk1MjBcbkpvaG5zb24sUkcsMTAvMjMvODksMy8yNC8xNyw5LzIwLzE3LDM4NDgwXG5QZXJhbGVzLEpvc2UsMy82Lzg5LDEwLzI5LzE1LDQvMjYvMTYsMzc0NDBcblBlcmFsZXMsVmFsZW50aW4sNS8yMi84MSw3LzIzLzE1LDEvMTkvMTYsMzc0NDBcblJpbGV5LExpc2EsNi8xOC82Nyw1LzEvMTMsMTAvMjgvMTMsMzUzNjBcbk1lZGluYSxSaWNreSw3LzEzLzg5LDEyLzE2LzE2LDYvMTQvMTcsMzMyODBcblNhbGF6b3IsTWVsZXNpbyw1LzIyLzgwLDkvMTYvMTUsMy8xNC8xNiwzMzI4MFxuV2lsbGlhbXMsVGVycnksOC8xNy83MCw2LzE1LzE1LDEyLzEyLzE1LDMzMjgwXG5FZHdhcmRzLER1c3Rpbiw2LzgvOTQsMS8yMy8xNCw3LzIyLzE0LDMxMjAwXG5XZWxscyxNYXR0LDgvMTAvOTYsMi8xNS8xNiw4LzEzLzE2LDMxMjAwXG5KdXJnb3ZhbixXaWxsaWFtLDcvMjcvOTAsOC8yNC8xNiwyLzIwLzE3LDI5MTIwXG5NYW5uaW5nLEJ1Y2ssNC84LzgxLDMvMTcvMTcsOS8xMy8xNywyNzA0MFxuIiwiYXNzdW1wdGlvbnMiOnsiYnVzaW5lc3NUeXBlIjoiQy1Db3JwIiwiZWZmZWN0aXZlRGF0ZSI6IjAxLzAxLzIwMTgiLCJ0ZW1wbGF0ZSI6ImRyZWFtIGZvcndhcmQiLCJyZXRpcmVtZW50QWdlIjo2NywibWluaW11bU1vbnRoc09mU2VydmljZSI6NiwidHJhZGl0aW9uYWxWZXN0aW5nTW9udGhzIjowLCJyb3RoVmVzdGluZ01vbnRocyI6MCwibWluaW11bUFnZSI6MjEsImVtcGxveWVlRGVmZXJyYWwiOjAuMDUsImVtcGxveWVyQ29udHJpYnV0aW9uIjowLjAzLCJlbXBsb3llck1hdGNoIjowLjAzLCJwcm9maXRTaGFyaW5nIjoxMDAwLCJhZG1pbkZlZSI6MjUwMCwicGVyRW1wbG95ZWVGZWUiOjM2LCJmZWVBZ2FpbnN0UGxhbkFzc2V0cyI6NzUsImVtcGxveWVyVGF4UGVyY2VudCI6MC4yNX19'>LINKY</a>
      }
      return <div>
        Your link is invalid. Please make sure you've copied it in it's entirety properly.
        {helper}
      </div>
    }

    let employerMatch
    if (this.state.assumptions.employerMatch) {
      employerMatch = <Specification
        users={this.state.users}
        assumptions={this.state.assumptions}
        title='Employer Match'
        match={this.state.assumptions.employerMatch}
        profitSharing={0}
        safeHarbor={0}
      />
    }

    let profitSharing
    if (this.state.assumptions.profitSharing) {
      profitSharing = <Specification
        users={this.state.users}
        assumptions={this.state.assumptions}
        title='Profit Sharing'
        match={0}
        profitSharing={this.state.assumptions.profitSharing}
        safeHarbor={0}
      />
    }

    let safeHarbor
    if (this.state.assumptions.safeHarborPercent) {
      safeHarbor = <Specification
        users={this.state.users}
        assumptions={this.state.assumptions}
        title='Safe Harbor'
        match={0}
        profitSharing={0}
        safeHarbor={this.state.assumptions.safeHarborPercent}
      />
    }
    return (
      <div className='main'>
        <div className='page'>
          <Overview users={this.state.users} assumptions={this.state.assumptions} />
        </div>
        <div className='page'>
          <Employees users={this.state.users} assumptions={this.state.assumptions} />
        </div>
        <div className='page'>
          <Specification
            users={this.state.users}
            assumptions={this.state.assumptions}
            title='No Match'
            match={0}
            profitSharing={0}
            safeHarbor={0}
          />
        </div>
        <div className='page'>
          {employerMatch}
        </div>
        <div className='page'>
          {profitSharing}
        </div>
        <div className='page'>
          {safeHarbor}
        </div>
      </div>
    )
  }
}

export default App
