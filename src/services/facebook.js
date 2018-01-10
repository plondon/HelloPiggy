const FBSDK = require('react-native-fbsdk')
const {
  LoginManager,
  AccessToken
} = FBSDK

export function facebookLogin () {
  return LoginManager.logInWithReadPermissions(['email'])
}

export function getCurrentAccessToken () {
  return AccessToken.getCurrentAccessToken()
}
