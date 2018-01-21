import React from 'react'
import { connect } from 'react-redux'
import { checkActiveUser, handleFacebookLogin, handleGoogleLogin } from '../actions'
import { ActivityIndicator, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

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
              <View style={styles.loginButtonView}>
                <Image source={require('../img/facebook.png')} style={{width: 16, height: 16, margin: 6}} />
                <Text style={styles.loginButtonText} onPress={() => this.handleFacebookLogin()}>Continue with Facebook</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.orView}>
              <Text style={styles.or}>Or</Text>
            </View>
            <TouchableHighlight style={styles.googleButton}>
              <View style={styles.loginButtonView}>
                <Image source={require('../img/google.png')} style={{width: 16, height: 16, margin: 6}} />
                <Text style={styles.loginButtonText} onPress={() => this.handleGoogleLogin()}>Continue with Google</Text>
              </View>
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
    borderRadius: 2,
    backgroundColor: '#4267b2'
  },
  'googleButton': {
    borderRadius: 2,
    backgroundColor: '#dd4b39'
  },
  'loginButtonView': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  'loginButtonText': {
    fontSize: 14,
    paddingRight: 20,
    paddingLeft: 6,
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
