import { getTransactions } from '../services/plaid'
import { onLogin, getCurrentAccessToken } from '../services/facebook'
import { onAuthStateChanged, onFacebookLogin, getSnapshot } from '../services/firebase'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import { fetchData, fetchUserSuccess, fetchFailure, fetchTxSuccess, routeTo } from '../actions'

export function * checkActiveUser () {
  yield put(fetchData())
  const user = yield call(onAuthStateChanged)
  if (user) {
    const snapshot = yield call(getSnapshot, user)
    const currentUser = snapshot.val()
    const plaid = currentUser.plaid
    const plaidComplete = plaid && plaid.token && plaid.accounts
    let route = !plaidComplete ? 'Plaid' : 'Home'

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
  const login = yield call(onLogin)
  if (login.isCancelled) {
    yield put(fetchFailure())
  } else {
    try {
      const token = yield call(getCurrentAccessToken)
      const user = yield call(onFacebookLogin, token)
      const snapshot = yield call(getSnapshot, user)
      yield put(fetchUserSuccess(snapshot))
    } catch (e) {
      yield put(fetchFailure(e))
    }
  }
}

export function * watchHandleFacebookLogin () {
  yield takeEvery('HANDLE_FACEBOOK_LOGIN', handleFacebookLogin)
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
    watchCheckActiveUser(),
    watchHandleFacebookLogin(),
    watchHandleTransactions()
  ])
}
