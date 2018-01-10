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

export function getSnapshot (user) {
  return firebase.database().ref('users/' + user.uid).once('value')
}

export function updateUser (user, settings) {
  firebase.database().ref('users/' + user.uid).update({ settings: settings })
}
