import React from 'react';
import * as firebase from 'firebase';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

export default class Overview extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <View style={styles.container}>
        <Text>{ user.username }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  }
});
