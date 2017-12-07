import React from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import devToolsEnhancer from 'remote-redux-devtools';
import app from './src/reducers'
import Auth from './src/components/Auth';
import Plaid from './src/components/Plaid';
import Create from './src/components/Create';
import Overview from './src/components/Overview';
import UserStats from './src/components/UserStats';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';

let store = createStore(app, devToolsEnhancer())

export default class App extends React.Component {
  constructor() {
    super()
    this.state = { user: null }
    this.onActiveUser = this.onActiveUser.bind(this)
  }
  
  onActiveUser(user) {
    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
      if (snapshot.val() !== null) this.setState({ user: snapshot.val(), activity: false });
      else this.setState({ user: user });
    });
  }

  render() {
    let user = this.state.user;
    return (
      <Provider store={store}>
        <Auth onActiveUser={this.onActiveUser.bind(this)} />
      </Provider>
    )
    // if (user && !user.plaid || user && user.plaid && !user.plaid.account) {
    //   return (
    //     <Plaid user={user} onComplete={this.onActiveUser.bind(this)}/>
    //   )
    // } else if (user && !user.stats) {
    //   return (
    //     <UserStats user={user} onComplete={this.onActiveUser.bind(this)}/>
    //   )
    // } else if (user) {
    //   return (
    //     <Overview user={user}/>
    //   )
    // } else {
    //   return (
    //     <Auth onActiveUser={this.onActiveUser.bind(this)}/>
    //   )
    // }
  }
}
