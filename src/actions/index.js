const FETCH_DATA = 'FETCH_DATA'
const CHECK_ACTIVE_USER = 'CHECK_ACTIVE_USER'
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE'

export const fetchData = () => ({
  type: FETCH_DATA
})

export const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  data: user
})

export const fetchUserFailure = () => ({
  type: FETCH_USER_FAILURE
})

export const checkActiveUser = () => ({
  type: CHECK_ACTIVE_USER
})
