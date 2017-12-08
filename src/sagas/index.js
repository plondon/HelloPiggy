import { call, put, takeEvery, all } from 'redux-saga/effects'
import { onLogin, getCurrentAccessToken } from '../services/facebook'
import { onAuthStateChanged, onFacebookLogin } from '../services/firebase'
import { fetchData, fetchUserSuccess, fetchFailure } from '../actions'

export function * checkActiveUser () {
  yield put(fetchData())
  try {
    const user = yield call(onAuthStateChanged)
    yield put(fetchUserSuccess(user))
  } catch (e) {
    yield put(fetchFailure(e))
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
      yield put(fetchUserSuccess(user))
    } catch (e) {
      yield put(fetchFailure(e))
    }
  }
}

export function * watchHandleFacebookLogin () {
  yield takeEvery('HANDLE_FACEBOOK_LOGIN', handleFacebookLogin)
}

export default function * rootSaga () {
  yield all([
    watchCheckActiveUser(),
    watchHandleFacebookLogin()
  ])
}
