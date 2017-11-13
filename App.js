import React from 'react';
import Auth from './src/components/Auth';
import Plaid from './src/components/Plaid';
import Create from './src/components/Create';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = { user: null }
    this.onActiveUser = this.onActiveUser.bind(this)
  }
  
  onActiveUser(user) {
    this.setState({ user: user });
  }
  
  render() {
    let user = this.state.user;
    if (true) {
      return (
        // <Plaid user={this.state.user}/>
        <Plaid/>
      )
    } else {
      return (
        <Auth onActiveUser={this.onActiveUser.bind(this)}/>
      )
    }
  }
}
