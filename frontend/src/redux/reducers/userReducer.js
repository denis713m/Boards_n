import * as types from '../actionTypes';

const initialState = {
    isFetching: true,
    error: false,
    user: null,    
  };

  export default function(state = initialState, action) {
    switch (action.type) {
      case types.REGISTRATION_USER_REQUEST:{        
        return {...state,
          isFetching: true}
      }
      case types.REGISTRATION_USER_SUCCESS:{
        return {...state,
            isFetching: false,
            user: action.data,
            error: null
        }
      }
      case types.REGISTRATION_USER_ERROR:{
        return {
          ...state,
          isFetching: false,
          error: action.error,
          user: null
        }
      }
      case types.LOG_OUT:{
        window.localStorage.removeItem('accessToken');
        return {
          ...state,
          isFetching: false,
          error: true,
          user: null
        }
      }
      default:
        return state;
    }
  }
  