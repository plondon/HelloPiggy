import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

const payFrequencyMap = {
  'semiMonthly': { human: 'two weeks', conversion: 2 },
  'monthly': { human: 'month', conversion: 1 },
  'weekly': { human: 'week', conversion: 4 },
  'daily': { human: 'day', conversion: 30 }
}

export default class Overview extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  
  componentDidMount() {
    const spending = this.props.user.plaid.account.balances.current;
    const { netIncome, payFrequency, savingsGoal, expenses } = this.props.user.stats;
    
    let lastPaid = new Date().getDate() % 15;
    let conversion = payFrequencyMap[payFrequency].conversion;
    let total = netIncome * conversion - savingsGoal - expenses;
    
    let daily = total / 30;
    let target = lastPaid * daily;
    let actual = spending / lastPaid;
    let today = daily - (spending - target - daily);
    
    this.setState({ daily, target, actual, today });
  }
  
  render() {
    const { user } = this.props;
    const { daily, target, actual, today } = this.state;

    return (
      <View style={styles.container}>
        <Text>{ user.username }</Text>
        <Text>You make ${ user.stats.netIncome } every { payFrequencyMap[user.stats.payFrequency].human }.</Text>
        <Text>You want to save ${ user.stats.savingsGoal } each month.</Text>
        <Text>You should be spending ${ daily } each day.</Text>
        <Text>You are spending ${ actual } on average.</Text>
        <Text>Today you can spend ${ today }.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  },
  'button': {
    height: 36,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
