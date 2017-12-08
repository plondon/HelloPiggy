import * as firebase from 'firebase'

export function onAuthStateChanged () {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(resolve)
  })
}

export function onFacebookLogin (data) {
  const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
  return firebase.auth().signInWithCredential(credential)
}
