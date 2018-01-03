import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Quotient extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.text}>{this.props.dividend}</Text>
        </View>
        <View style={styles.divisorView}>
          <Text style={styles.text}>{this.props.divisor}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  divisorView: {
    borderTopWidth: 2,
    borderTopColor: '#BB2273'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})
