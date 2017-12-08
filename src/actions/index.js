const FETCH_DATA = 'FETCH_DATA'
const FETCH_FAILURE = 'FETCH_FAILURE'
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
const CHECK_ACTIVE_USER = 'CHECK_ACTIVE_USER'

const HANDLE_FACEBOOK_LOGIN = 'HANDLE_FACEBOOK_LOGIN'

export const fetchData = () => ({
  type: FETCH_DATA
})

export const fetchUserSuccess = (user) => ({
  type: FETCH_USER_SUCCESS,
  data: user
})

export const fetchFailure = () => ({
  type: FETCH_FAILURE
})

export const checkActiveUser = () => ({
  type: CHECK_ACTIVE_USER
})

export const handleFacebookLogin = () => ({
  type: HANDLE_FACEBOOK_LOGIN
})
