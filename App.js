import React from 'react';
import Auth from './src/components/Auth';
import Plaid from './src/components/Plaid';
import Create from './src/components/Create';
import Overview from './src/components/Overview';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = { user: null }
    this.onActiveUser = this.onActiveUser.bind(this)
  }
  
  onActiveUser(user) {
    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
      if (snapshot.val() !== null) this.setState({ user: snapshot.val(), activity: false });
      else this.createUser(user);
    });
  }
  
  createUser(user) {
    firebase.database().ref('users/' + user.uid).set({
      username: user.displayName,
      email: user.email,
      picture : user.photoURL
    }).then(() => this.onActiveUser(user));
  }
  
  render() {
    let user = this.state.user;
    if (user) {
      return (
        // <Plaid user={this.state.user}/>
        <Overview user={this.state.user}/>
      )
    } else {
      return (
        <Auth onActiveUser={this.onActiveUser.bind(this)}/>
      )
    }
  }
}
