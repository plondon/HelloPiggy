import { combineReducers } from 'redux'

const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        isFetching: true
      }
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        isFetching: false,
        user: action.data
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({ dataReducer })

export default rootReducer
