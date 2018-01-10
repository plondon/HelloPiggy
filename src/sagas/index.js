import { getTransactions } from '../services/plaid'
import { facebookLogin, getCurrentAccessToken } from '../services/facebook'
import { onAuthStateChanged, onFacebookLogin, getSnapshot, updateUser, onGoogleLogin } from '../services/firebase'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import { fetchData, fetchUserSuccess, fetchFailure, fetchTxSuccess, routeTo } from '../actions'

const plaidComplete = (plaid) => plaid && plaid.token && plaid.accounts
const determineRoute = (currentUser) => {
  if (!plaidComplete(currentUser.plaid)) return 'Plaid'
  else if (!currentUser.settings) return 'Settings'
  else return 'Home'
}

export function * checkActiveUser () {
  yield put(fetchData())
  const user = yield call(onAuthStateChanged)
  if (user) {
    const snapshot = yield call(getSnapshot, user)
    const currentUser = snapshot.val()
    const route = determineRoute(currentUser)
    yield put(fetchUserSuccess(currentUser))
    yield put(routeTo(route))
  } else {
    yield put(fetchFailure())
  }
}

export function * watchCheckActiveUser () {
  yield takeEvery('CHECK_ACTIVE_USER', checkActiveUser)
}

export function * handleFacebookLogin () {
  yield put(fetchData())
  const login = yield call(facebookLogin)
  if (login.isCancelled) {
    yield put(fetchFailure())
  } else {
    try {
      const token = yield call(getCurrentAccessToken)
      const user = yield call(onFacebookLogin, token)
      const snapshot = yield call(getSnapshot, user)
      const currentUser = snapshot.val()
      let route = determineRoute(currentUser)
      yield put(fetchUserSuccess(currentUser))
      yield put(routeTo(route))
    } catch (e) {
      yield put(fetchFailure(e))
    }
  }
}

export function * watchHandleFacebookLogin () {
  yield takeEvery('HANDLE_FACEBOOK_LOGIN', handleFacebookLogin)
}

export function * handleGoogleLogin () {
  yield put(fetchData())
  const login = yield call(onGoogleLogin)
  console.log(login)
}

export function * watchHandleGoogleLogin () {
  yield takeEvery('HANDLE_GOOGLE_LOGIN', handleGoogleLogin)
}

export function * handleUpdateUser (opts) {
  yield call(updateUser, opts.data.user, opts.data.settings)
  const snapshot = yield call(getSnapshot, opts.data.user)
  const currentUser = snapshot.val()
  yield put(fetchUserSuccess(currentUser))
}

export function * watchUpdateUser () {
  yield takeEvery('UPDATE_USER', handleUpdateUser)
}

export function * handleTransactions (opts) {
  yield put(fetchData())
  const txs = yield call(getTransactions, opts)
  try {
    yield put(fetchTxSuccess(txs))
  } catch (e) {
    yield put(fetchFailure(e))
  }
}

export function * watchHandleTransactions () {
  yield takeEvery('HANDLE_TRANSACTIONS', handleTransactions)
}

export default function * rootSaga () {
  yield all([
    watchUpdateUser(),
    watchCheckActiveUser(),
    watchHandleFacebookLogin(),
    watchHandleGoogleLogin(),
    watchHandleTransactions()
  ])
}
