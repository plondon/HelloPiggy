import React from 'react';
import axios from 'axios';
import PlaidAuthenticator from 'react-native-plaid-link';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

var authorize = 'http://localhost:8000/auth';
var getTransactions = 'http://localhost:8000/get_txs';
var getAccessToken = 'http://localhost:8000/get_access_token';

export default class Plaid extends React.Component {
  state = {
    data: {},
    access: false,
    activity: false
  }
  
  onMessage = (data) => {
    data.metadata && data.metadata.public_token ? this.getAccess(data.metadata.public_token) : this.setState({data});
  }
  
  getAccess = (token) => {
    this.setState({ activity: true });
    axios({ method: 'post', url: getAccessToken,
      params: {
        public_token: token
      }
    }).then((res) => {
      axios({ method: 'get', url: authorize,
        params: {
          access_token: res.data.accessToken
        }
      }).then((res) => { this.setState({ activity: false, access: true, data: res.data }); })
    });
  }
  
  getTransactions = () => {
    this.setState({ activity: true });
    axios({ method: 'post', url: getTransactions,
      params: {
        access_token: 1
      }
    }).then((res) => { debugger; this.setState({ access: true, data: res }) })
  }

  render () {
    return this.state.access ? this.renderDetails() : this.renderLogin();
  }
  
  renderDetails () {
    // const { accounts } = this.state.data;

    // const accountsView = accounts.map((account) => {
    //   return (
    //     <View key={account.account_id}>
    //       <Text>{account.balances.available}</Text>
    //     </View>
    //   );
    // });
    
    console.log(this.state.data);
    
    return null;
    
    // return (
    //   <View>
    //     {accountsView}
    //   </View>
    // )
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
  container: {
    flex: 1,
    paddingTop: 24,
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
