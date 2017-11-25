import React from 'react';
import t from 'tcomb-form-native';
import * as firebase from 'firebase';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

let Form = t.form.Form;

let Frequencies = t.enums({
  'semiMonthly': 'Semi-Monthly (Twice Each Month)',
  'monthly': 'Monthly',
  'biWeekly': 'Bi-Weekly (Every Other Week)',
  'weekly': 'Weekly',
  'daily': 'Daily'
});

let Profile = t.struct({
  netIncome: t.Number,
  savingsGoal: t.Number,
  payFrequency: Frequencies
})

let options = {
  fields: {
    netIncome: {
      label: 'Net Income Per Paycheck:'
    },
    savingsGoal: {
      label: 'Savings Goal:'
    },
    payFrequency: {
      label: 'Pay Frequency:'
    }
  }
}

export default class ProfileSetup extends React.Component {
  constructor() {
    super()
  }
  
  createUser() {
    let user = firebase.auth().currentUser;
    let { netIncome, payFrequency } = this.refs.form.getValue();
    
    firebase.database().ref('users/' + user.uid).set({
      username: user.displayName,
      email: user.email,
      picture : user.photoURL,
      stats: {
        netIncome: netIncome,
        payFrequency: payFrequency
      }
    }).then(() => this.props.onComplete(user));
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Profile}
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
