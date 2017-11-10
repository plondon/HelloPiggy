import React from 'react';
import PlaidAuthenticator from 'react-native-plaid-link';
import { View, Text, StyleSheet } from 'react-native';

export default class Plaid extends React.Component {
  state = {
    data: {}
  }
  
  onMessage = (data) => {
    this.setState({data})
  }
  
  render () {
    return this.state.data.action && this.state.data.action.indexOf('::connected') > -1 ? this.renderDetails() : this.renderLogin();
  }
  
  renderDetails () {
    return (
      <View style={styles.container}>
        <Text>Bank Details</Text>
        <Text>{this.state.data.metadata.institution.name}</Text>
      </View>
    )
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
