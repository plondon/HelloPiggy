import React from 'react'
import { connect } from 'react-redux'
import Auth from '../components/Auth'
import Plaid from '../components/Plaid'
import Overview from '../components/Overview'
import UserStats from '../components/UserStats'

class MainContainer extends React.Component {
  render () {
    let { user, route } = this.props

    if (route === 'Plaid') {
      return (
        <Plaid user={user} />
      )
    } else if (route === 'Settings') {
      return (
        <UserStats user={user} />
      )
    } else if (route === 'Home') {
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
    user: state.dataReducer.user,
    route: state.routeReducer.route
  }
}

export default connect(mapStateToProps)(MainContainer)
