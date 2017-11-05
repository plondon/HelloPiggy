import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
var t = require('tcomb-form-native');

var Form = t.form.Form;

var NewUser = t.struct({
  name: t.String,              
  monthlySalary: t.Number,
  amountToSave: t.Number
});

export default class Create extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={NewUser}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 20,
    marginTop: 50,
    backgroundColor: '#AED581'
  }
});
