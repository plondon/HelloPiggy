import React from 'react'
import { connect } from 'react-redux'
import { routeTo } from '../actions'
import Auth from '../components/Auth'
import Plaid from '../components/Plaid'
import Overview from '../components/Overview'
import Settings from '../components/Settings'
import { TabBarIOS } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

class MainContainer extends React.Component {
  render () {
    let { user, route } = this.props

    if (route === 'Settings' || route === 'Home') {
      return (
        <TabBarIOS>
          <Icon.TabBarItem onPress={() => this.props.dispatch(routeTo('Settings'))} title={'Settings'} iconName={'ios-cog'} selected={route === 'Settings'}>
            <Settings user={user} />
          </Icon.TabBarItem>
          <Icon.TabBarItem onPress={() => this.props.dispatch(routeTo('Home'))} title={'Home'} iconName={'ios-home-outline'} selected={route === 'Home'}>
            <Overview user={user} />
          </Icon.TabBarItem>
        </TabBarIOS>
      )
    } else {
      if (route === 'Plaid') {
        return (<Plaid />)
      } else {
        return (<Auth />)
      }
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
