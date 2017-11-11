import React from 'react';
import * as firebase from 'firebase';
import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
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
  }
  
  handleLogin() {
    firebase.auth().signInWithRedirect(facebookProvider).then((res) => {
      debugger;
    });
  }
  
  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      app.database().ref('users/' + result.id).set({
        email: result.email
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.handleLogin}>
          <Text>Login via Facebook</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  }
});
