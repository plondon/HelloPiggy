import * as firebase from 'firebase';

export function onAuthStateChanged() {
  return new Promise (resolve => {
    firebase.auth().onAuthStateChanged(resolve)
  })
}
