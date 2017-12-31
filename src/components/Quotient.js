import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Quotient extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <View>
          <Text>{this.props.dividend}</Text>
        </View>
        <View style={styles.divisor}>
          <Text>{this.props.divisor}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  divisor: {
    borderTopWidth: 1,
    borderTopColor: 'black'
  }
})
