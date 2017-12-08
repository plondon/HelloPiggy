const FBSDK = require('react-native-fbsdk')
const {
  LoginManager,
  AccessToken
} = FBSDK

export function onLogin () {
  return LoginManager.logInWithReadPermissions(['email'])
}

export function getCurrentAccessToken () {
  return AccessToken.getCurrentAccessToken()
}
