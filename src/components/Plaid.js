import React from 'react';
import axios from 'axios';
import * as firebase from 'firebase';
import PlaidAuthenticator from 'react-native-plaid-link';
import { View, Text, StyleSheet, ActivityIndicator, TouchableHighlight } from 'react-native';

var authorize = 'http://localhost:8000/auth';
var getAccessToken = 'http://localhost:8000/get_access_token';

export default class Plaid extends React.Component {
  state = {
    data: {},
    activity: true
  }
  
  componentDidMount() {
    let { user } = this.props;

    if (!user.plaid) this.setState({ activity: false });
    else this.getAuthorization(user.plaid.token);
  }

  setPlaidToken = (token) => firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plaid').update({ token: token });

  setBankAccount = (account) => firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plaid').update({ account: account }).then(this.props.onComplete())

  onMessage = (data) => data.metadata && data.metadata.public_token ? this.getAccessToken(data.metadata.public_token) : this.setState({data});
  
  getAuthorization = (token) => {
    axios({ method: 'get', url: authorize,
      params: {
        access_token: token
      }
    }).then((res) => this.setState({ activity: false, data: res.data }));
  }
  
  getAccessToken = (token) => {
    this.setState({ activity: true });
    axios({ method: 'post', url: getAccessToken,
      params: {
        public_token: token
      }
    }).then((res) => {
      let token = res.data.accessToken;
      this.setPlaidToken(token).then(() => this.getAuthorization(token));
    });
  }

  render () {
    let { user } = this.props;
    let { data } = this.state;

    if (user.plaid || data.accounts) {
      return this.renderDetails();
    } else {
      return this.renderLogin();
    }
  }
  
  renderDetails () {
    const { activity, data } = this.state;

    if (activity) {
      return (
        <ActivityIndicator style={styles.centering} size="large"/>
      )
    } else {
      const accountsView = data.accounts.map((account) => {
        return (
          <View key={account.account_id}>
            <TouchableHighlight onPress={() => this.setBankAccount(account)}>
              <View>
                <Text>{ account.name }</Text>
                <Text>Balance: {account.balances.current}</Text>
              </View>
            </TouchableHighlight>
          </View>
        );
      });
      
      return (
        <View style={styles.container}>
          <Text>Select Account:</Text>
          <View>
            {accountsView}
          </View>
        </View>
      )
    }
  }
  
  renderLogin () {
    const { activity } = this.state;

    if (activity) {
      return (
        <ActivityIndicator style={styles.centering} size="large"/>
      )
    } else {
      return (
        <PlaidAuthenticator
        onMessage={this.onMessage}
        publicKey="70899249dbfcd49ba8df6af8b2df65"
        env="development"
        product="auth,transactions"
        clientName="HelloPiggy"
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  },
  centering: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
