import React from 'react';
import t from 'tcomb-form-native';
import * as firebase from 'firebase';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

let Form = t.form.Form;

let Frequencies = t.enums({
  'semiMonthly': 'Semi-Monthly (Twice Each Month)',
  'monthly': 'Monthly',
  'weekly': 'Weekly',
  'daily': 'Daily'
});

let Stats = t.struct({
  netIncome: t.Number,
  payFrequency: Frequencies,
  savingsGoal: t.Number,
  spending: t.Number,
  expenses: t.Number
})

let options = {
  fields: {
    netIncome: {
      label: 'Net Income per Paycheck:'
    },
    payFrequency: {
      label: 'Pay Frequency:'
    },
    savingsGoal: {
      label: 'Monthly Savings Goal:'
    },
    spending: {
      label: 'Spending this Month:'
    },
    expenses: {
      label: 'Monthly Expenses (rent, etc...)'
    }
  }
}

export default class UserStats extends React.Component {
  constructor() {
    super()
  }
  
  createUser() {
    let user = firebase.auth().currentUser;
    let { netIncome, payFrequency, savingsGoal, spending, expenses } = this.refs.form.getValue();
    
    firebase.database().ref('users/' + user.uid).set({
      username: user.displayName,
      email: user.email,
      picture : user.photoURL,
      stats: {
        netIncome: netIncome,
        payFrequency: payFrequency,
        savingsGoal: savingsGoal,
        spending: spending,
        expenses: expenses
      }
    }).then(() => this.props.onComplete(user));
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Stats}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.createUser.bind(this)}>
          <Text>Save</Text>
        </TouchableHighlight>
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
