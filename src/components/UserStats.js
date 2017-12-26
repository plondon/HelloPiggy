import React from 'react'
import * as firebase from 'firebase'
import { format } from '../services/helpers'
import { Picker, StyleSheet, Slider, Text, TouchableHighlight, View } from 'react-native'

let payFrequencies = {
  'semiMonthly': 'Semi-Monthly (Twice Each Month)',
  'monthly': 'Monthly',
  'weekly': 'Weekly',
  'daily': 'Daily'
}

export default class UserStats extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    let defaultN = 2500
    const { stats } = this.props.user

    this.setState({
      netIncome: stats.netIncome || defaultN,
      payFrequency: stats.payFrequency || 'semiMonthly',
      savingsGoal: stats.savingsGoal || defaultN,
      expenses: stats.expenses || defaultN
    })
  }

  updateUser () {
    let user = firebase.auth().currentUser
    let { netIncome, payFrequency, savingsGoal, expenses } = this.state

    firebase.database().ref('users/' + user.uid).update({
      username: user.displayName,
      email: user.email,
      picture: user.photoURL,
      stats: {
        netIncome: netIncome,
        payFrequency: payFrequency,
        savingsGoal: savingsGoal,
        expenses: expenses
      }
    }).then(() => this.props.onComplete(user))
  }

  updateStat (stat, n) {
    this.setState({ [stat]: n })
  }

  render () {
    const { netIncome, payFrequency, savingsGoal, expenses } = this.state

    return (
      <View style={styles.container}>
        <Slider style={styles.slider} step={5} minimumValue={0} maximumValue={5000} value={netIncome} onValueChange={this.updateStat.bind(this, 'netIncome')} />
        <Text style={styles.text}>Your Net Pay per paycheck is: { format(netIncome) }</Text>
        <Slider style={styles.slider} step={5} minimumValue={0} maximumValue={5000} value={savingsGoal} onValueChange={this.updateStat.bind(this, 'savingsGoal')} />
        <Text style={styles.text}>Your savings goal per paycheck is: { format(savingsGoal) }</Text>
        <Slider style={styles.slider} step={5} minimumValue={0} maximumValue={5000} value={expenses} onValueChange={this.updateStat.bind(this, 'expenses')} />
        <Text style={styles.text}>Your expenses each month are: { format(expenses) }</Text>
        <View>
          <Picker style={{width: 100}} selectedValue={payFrequency} onValueChange={this.updateStat.bind(this, 'payFrequency')}>
            <Picker.Item label='Semi-Monthly (Twice Each Month)' value='semiMonthly' />
            <Picker.Item label='Monthly' value='monthly' />
            <Picker.Item label='Weekly' value='weekly' />
            <Picker.Item label='Daily' value='daily' />
          </Picker>
          <Text style={styles.label}>You're paid: { payFrequencies[payFrequency] }</Text>
        </View>
        <TouchableHighlight style={styles.button} onPress={this.updateUser.bind(this)}>
          <Text>Save</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  'container': {
    padding: 30,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FEDCD3'
  },
  'text': {
    fontSize: 12,
    marginBottom: 20,
    fontFamily: 'ProximaNovaA-Regular'
  },
  'label': {
    fontSize: 12,
    fontFamily: 'ProximaNovaA-Regular'
  },
  'slider': {
    width: '100%'
  },
  'button': {
    height: 36,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
})
