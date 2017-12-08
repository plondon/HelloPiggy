import React from 'react'
import { connect } from 'react-redux'
import { checkActiveUser, handleFacebookLogin } from '../actions'
import { View, Text, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'

class Auth extends React.Component {
  componentDidMount () {
    this.props.dispatch(checkActiveUser())
  }

  handleFacebookLogin () {
    this.props.dispatch(handleFacebookLogin())
  }

  render () {
    const { isFetching } = this.props

    if (isFetching) {
      return (
        <ActivityIndicator style={styles.centering} size='large' />
      )
    } else {
      return (
        <View style={styles.container}>
          <TouchableHighlight onPress={() => this.handleFacebookLogin()}>
            <Text>Login via Facebook</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.dataReducer.isFetching
  }
}

export default connect(mapStateToProps)(Auth)

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    alignItems: 'center'
  },
  'centering': {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
