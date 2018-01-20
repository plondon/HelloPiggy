import React from 'react'
import { connect } from 'react-redux'
import { checkActiveUser, handleFacebookLogin, handleGoogleLogin } from '../actions'
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

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
            <TouchableHighlight style={styles.facebookButton}>
              <Text style={styles.facebookButtonText} onPress={() => this.handleFacebookLogin()}>Login with Facebook</Text>
            </TouchableHighlight>
            <View style={styles.orView}>
              <Text style={styles.or}>Or</Text>
            </View>
            <TouchableHighlight>
              <Text onPress={() => this.handleGoogleLogin()}>Login with Google+</Text>
            </TouchableHighlight>
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
  'facebookButton': {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 7,
    paddingLeft: 7,
    borderRadius: 2,
    backgroundColor: '#4267b2'
  },
  'facebookButtonText': {
    fontSize: 14,
    color: '#FFFFFF'
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
