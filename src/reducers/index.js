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
        user: action.data.val()
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isFetching: false
      }
    case 'FETCH_TX_SUCCESS':
      return {
        ...state,
        isFetching: false,
        transactions: action.data.transactions
      }
    default:
      return state
  }
}

const routeReducer = (state = {}, action) => {
  console.log(action)
  switch (action.type) {
    case 'ROUTE_TO':
      return {
        ...state,
        route: action.data
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({ dataReducer, routeReducer })

export default rootReducer
