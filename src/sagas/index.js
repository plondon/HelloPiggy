import { call, put, takeEvery, all } from 'redux-saga/effects'
import { onAuthStateChanged } from '../services/firebase'
import { fetchUserSuccess } from '../actions';

export function* checkActiveUser() {
  yield put({ type: 'FETCH_DATA' })
  try {
    const user = yield call(onAuthStateChanged)
    yield put(fetchUserSuccess(user))
  } catch (e) {
    console.log(e);
    yield put({ type: 'FETCH_USER_FAILURE' })
  }
}

export function* watchCheckActiveUser() {
  yield takeEvery('CHECK_ACTIVE_USER', checkActiveUser)
}

export default function* rootSaga() {
  yield all([
    watchCheckActiveUser()
  ])
}
