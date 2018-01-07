import React from 'react'
import { connect } from 'react-redux'
import { routeTo } from '../actions'
import { TabBarIOS, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const items = [
  {icon: 'cog', name: 'Settings'},
  {icon: 'home', name: 'Home'},
  {icon: 'ellipsis-h', name: 'More'}
]

class TabBar extends React.Component {
  render () {
    const { route } = this.props

    return (
      <TabBarIOS>
        { items.map((item, i) => {
          if (item.name === route) {
            return (
              <Icon.TabBarItem selected key={i} onPress={() => this.props.dispatch(routeTo({route: item.name}))} title={item.name} iconName={item.icon} selectedIconName={item.icon}>
                <View><Text>{item.name}</Text></View>
              </Icon.TabBarItem>
            )
          } else {
            return (
              <Icon.TabBarItem key={i} onPress={() => this.props.dispatch(routeTo({route: item.name}))} title={item.name} iconName={item.icon} selectedIconName={item.icon}>
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
    route: state.dataReducer.user
  }
}

export default connect(mapStateToProps)(TabBar)
