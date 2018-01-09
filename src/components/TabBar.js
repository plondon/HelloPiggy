import React from 'react'
import { connect } from 'react-redux'
import { routeTo } from '../actions'
import { TabBarIOS, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

const items = [
  {icon: 'ios-cog', selectedIcon: 'ios-cog-outline', name: 'Settings'},
  {icon: 'ios-home', selectedIcon: 'ios-home-outline', name: 'Home'},
  {icon: 'ios-more', selectedIcon: 'ios-more-outline', name: 'More'}
]

class TabBar extends React.Component {
  render () {
    const { route } = this.props

    return (
      <TabBarIOS>
        { items.map((item, i) => {
          if (item.name === route) {
            return (
              <Icon.TabBarItem key={i} onPress={() => this.props.dispatch(routeTo(item.name))} title={item.name} iconName={item.selectedIcon}>
                <View><Text>{item.name}</Text></View>
              </Icon.TabBarItem>
            )
          } else {
            return (
              <Icon.TabBarItem key={i} onPress={() => this.props.dispatch(routeTo(item.name))} title={item.name} iconName={item.icon}>
                <View><Text>{item.name}</Text></View>
              </Icon.TabBarItem>
            )
          }
        }) }
      </TabBarIOS>
    )
  }
}

const mapStateToProps = state => {
  return {
    route: state.routeReducer.route
  }
}

export default connect(mapStateToProps)(TabBar)
