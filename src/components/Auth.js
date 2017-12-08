import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { checkActiveUser } from '../actions';
import { Image, View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;

const facebookProvider = new firebase.auth.FacebookAuthProvider();

class Auth extends React.Component {
  componentDidMount() {
    this.props.dispatch(checkActiveUser())
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
        this.props.onActiveUser(currentUser)
      })
      .catch((error) => {
        console.log(`Login fail with error: ${error}`);
      });
  }

  render() {
    const { isFetching } = this.props;
    
    if (isFetching) {
      return (
        <ActivityIndicator style={styles.centering} size="large"/>
      )
    } else {
      return (
        <View style={styles.container}>
          <TouchableHighlight onPress={() => this.handleLogin()}>
            <Text>Login via Facebook</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.dataReducer.isFetching
  }
}

export default connect(mapStateToProps)(Auth)

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
