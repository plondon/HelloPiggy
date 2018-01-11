import React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { checkActiveUser, handleFacebookLogin, handleGoogleLogin } from '../actions'

class Auth extends React.Component {
  componentDidMount () {
    this.props.dispatch(checkActiveUser())
  }

  handleFacebookLogin () {
    this.props.dispatch(handleFacebookLogin())
  }

  handleGoogleLogin () {
    this.props.dispatch(handleGoogleLogin())
  }

  render () {
    const { isFetching } = this.props

    if (isFetching) {
      return (
        <ActivityIndicator style={styles.centering} size='large' />
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={styles.headerView}>
            <Text style={styles.header}>🐷HelloPiggy</Text>
          </View>
          <View style={styles.centering}>
            <View>
              <Text onPress={() => this.handleFacebookLogin()}>Facebook</Text>
            </View>
            <View style={styles.orView}>
              <Text style={styles.or}>Or</Text>
            </View>
            <View>
              <Text onPress={() => this.handleGoogleLogin()}>Login with Google+</Text>
            </View>
          </View>
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
  'headerView': {
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#FFAEBD'
  },
  'header': {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#F8F7F5'
  },
  'orView': {
    marginTop: 10,
    marginBottom: 10
  },
  'or': {
    color: '#6E6E69'
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
