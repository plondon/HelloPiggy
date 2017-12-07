import { combineReducers } from 'redux'

const initialState = { isFetching: true }

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        isFetching: true
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}

const app = combineReducers({ dataReducer })

export default app
