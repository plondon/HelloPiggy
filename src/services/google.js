import { GoogleSignin } from 'react-native-google-signin'

export function googleLogin () {
  return GoogleSignin.configure({ iosClientId: '934580057547-8qumjljg82hh0qh0lr142ud1q648qa6c.apps.googleusercontent.com' }).then(() => GoogleSignin.signIn())
}
