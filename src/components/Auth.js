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

export default class Auth extends React.Component {
  constructor() {
    super();
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
        <LoginButton
          readPermissions={['email', 'public_profile']}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(() => {
                  const infoRequest = new GraphRequest(
                    '/me?fields=email',
                    null,
                    this._responseInfoCallback
                  );
                  // Start the graph request.
                  new GraphRequestManager().addRequest(infoRequest).start();
                });
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
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
