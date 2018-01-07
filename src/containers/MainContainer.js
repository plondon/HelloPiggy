import React from 'react'
import { connect } from 'react-redux'
import Auth from '../components/Auth'
import Plaid from '../components/Plaid'
import Overview from '../components/Overview'
import UserStats from '../components/UserStats'

class MainContainer extends React.Component {
  render () {
    let user = this.props.user
    // let plaidComplete = user && user.plaid.token && user.plaid.accounts

    if (user) {
      return (
        <Plaid user={user} />
      )
    } else if (user && !user.stats) {
      return (
        <UserStats user={user} />
      )
    } else if (user) {
      return (
        <Overview user={user} />
      )
    } else {
      return (
        <Auth />
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.dataReducer.user
  }
}

export default connect(mapStateToProps)(MainContainer)
