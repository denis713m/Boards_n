import * as types from '../actionTypes';

const initialState = {
    isFetching: false,
    lists:[],
    error: null
}

export default function(state = initialState, action) {
    switch (action.type) {
      case types.LIST_REQUEST:{
        state.isFetching = true;
        return {...state}
      }
      case types.LIST_CREATE_SUCCESS:{
        return{
            ...state,
            isFetching: false,
            lists:[...state.lists, action.data],
            error: null
        }
      }
      case types.GET_LISTS_BY_BOARD_SUCCESS:{
        return{
            ...state,
            isFetching: false,
            lists:[...action.data],
            error: null
        }
      }
      case types.LIST_DELETE_SUCCESS:{
        return{
            ...state,
            isFetching: false,
            lists:[...action.data],
            error: null
        }
      }
      case types.LIST_RENAME_SUCCESS:{
        return{
            ...state,
            isFetching: false,
            lists:[...action.data],
            error: null
        }
      }
      default:{
        return state;
        }
    }
}