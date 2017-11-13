import React from 'react';
import axios from 'axios';
import PlaidAuthenticator from 'react-native-plaid-link';
import { View, Text, StyleSheet } from 'react-native';

export default class Plaid extends React.Component {
  state = {
    data: {}
  }
  
  onMessage = (data) => {
    data.metadata && data.metadata.public_token ? this.getAccess(data.metadata.public_token) : this.setState({data});
  }
  
  getAccess(token) {
    axios({
      method: 'post',
      url: 'http://localhost:8000/get_access_token',
      params: {
        public_token: token
      }
    }).then((res) => {
      console.log(res);
    });
  }
  
  render () {
    return this.state.data.action && this.state.data.action.indexOf('::connected') > -1 ? this.renderDetails() : this.renderLogin();
  }
  
  renderDetails () {
    return null;
  }
  
  renderLogin () {
    return (
      <PlaidAuthenticator
        onMessage={this.onMessage}
        publicKey="70899249dbfcd49ba8df6af8b2df65"
        env="sandbox"
        product="auth,transactions"
        clientName="HelloPiggy"
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    alignItems: 'center'
  }
})
