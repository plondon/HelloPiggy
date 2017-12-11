import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Quotient extends React.Component {
  render () {
    return (
      <View>
        <View style={styles.dividend}>
          <Text>{this.props.dividend}</Text>
        </View>
        <View>
          <Text>{this.props.divisor}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  dividend: {
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  }
})
