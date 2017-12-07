const FETCH_DATA = 'FETCH_DATA'
const AUTH_FAILURE = 'AUTH_FAILURE'

export const fetchData = () => ({
  type: FETCH_DATA
})

export const authFailure = () => ({
  type: AUTH_FAILURE
})
