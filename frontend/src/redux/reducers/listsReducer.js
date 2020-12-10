import * as types from '../actionTypes';

const initialState = {
    isFetching: false,
    lists: [],
    error: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.LIST_REQUEST: {
            return { ...state, isFetching: true };
        }
        case types.LIST_CREATE_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                lists: [...state.lists, action.data],
                error: null,
            };
        }
        case types.GET_LISTS_BY_BOARD_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                lists: [...action.data],
                error: null,
            };
        }
        case types.LIST_DELETE_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                lists: [...action.data],
                error: null,
            };
        }
        case types.LIST_RENAME_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                lists: [...action.data],
                error: null,
            };
        }      
      case types.LIST_OPERATION_ERROR:{
        return{
            ...state,
            isFetching: false,
            error: action.error
        }
      }    
      default:{
        return state;
        }
    }
}
