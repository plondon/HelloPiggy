import React from 'react';
import * as firebase from 'firebase';
import { Image, View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;

const app = firebase.initializeApp({
  apiKey: "AIzaSyDmn2WLeDxznRUlkIIOOpYBfTFvSn0g8QQ",
  authDomain: "hello-piggy.firebaseapp.com",
  databaseURL: "https://hello-piggy.firebaseio.com/",
  storageBucket: "gs://hello-piggy.appspot.com"
});

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export default class Auth extends React.Component {
  constructor() {
    super();
    var user = firebase.auth().currentUser;
    this.state = { user: user, activity: false }
  }
  
  handleLogin() {
    this.setState({ activity: true });
    LoginManager
      .logInWithReadPermissions(['email'])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error('The user cancelled the request'));
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        return firebase.auth().signInWithCredential(credential);
      })
      .then((currentUser) => {
        this.setState({ user: currentUser })
      })
      .catch((error) => {
        console.log(`Login fail with error: ${error}`);
      }).finally(() => { this.setState({ activity: false }) });
  }

  render() {
    const { user, activity } = this.state;
    
    if (activity) {
      return (
        <ActivityIndicator style={styles.centering} size="large"/>
      )
    } else {
      return (
        <View style={styles.container}>
          {user ? (
            <View>
              <Text>{user.displayName}</Text>
              <Image style={{width: 100, height: 100}} source={{uri: user.photoURL}} />
            </View>
          ) : (
            <TouchableHighlight onPress={() => this.handleLogin()}>
              <Text>Login via Facebook</Text>
            </TouchableHighlight>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  },
  'centering': {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
