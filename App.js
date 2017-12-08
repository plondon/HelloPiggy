import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import rootReducer from './src/reducers'
import rootSaga from './src/sagas'
import Auth from './src/components/Auth'
import Plaid from './src/components/Plaid'
import Create from './src/components/Create'
import Overview from './src/components/Overview'
import UserStats from './src/components/UserStats'
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
  constructor () {
    super()
    this.state = { user: null }
    this.onActiveUser = this.onActiveUser.bind(this)
  }

  onActiveUser (user) {
    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
      if (snapshot.val() !== null) this.setState({ user: snapshot.val(), activity: false })
      else this.setState({ user: user })
    })
  }

  render() {
    let user = this.state.user
    return (
      <Provider store={store}>
        <Auth onActiveUser={this.onActiveUser.bind(this)} />
      </Provider>
    )
    // if (user && !user.plaid || user && user.plaid && !user.plaid.account) {
    //   return (
    //     <Plaid user={user} onComplete={this.onActiveUser.bind(this)}/>
    //   )
    // } else if (user && !user.stats) {
    //   return (
    //     <UserStats user={user} onComplete={this.onActiveUser.bind(this)}/>
    //   )
    // } else if (user) {
    //   return (
    //     <Overview user={user}/>
    //   )
    // } else {
    //   return (
    //     <Auth onActiveUser={this.onActiveUser.bind(this)}/>
    //   )
    // }
  }
}
