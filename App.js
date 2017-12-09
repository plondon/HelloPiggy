import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { StyleSheet } from 'react-native'
import { composeWithDevTools } from 'remote-redux-devtools'
import MainContainer from './src/containers/MainContainer'
import rootReducer from './src/reducers'
import rootSaga from './src/sagas'
import * as firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyDmn2WLeDxznRUlkIIOOpYBfTFvSn0g8QQ',
  authDomain: 'hello-piggy.firebaseapp.com',
  databaseURL: 'https://hello-piggy.firebaseio.com/',
  storageBucket: 'gs://hello-piggy.appspot.com'
})

const sagaMiddleware = createSagaMiddleware()
let store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)))
sagaMiddleware.run(rootSaga)

export default class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <MainContainer style={styles.container} />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  'container': {
    marginTop: 40,
    color: '#6E6E69',
    alignItems: 'center',
    backgroundColor: '#FFAEBD'
  }
})
