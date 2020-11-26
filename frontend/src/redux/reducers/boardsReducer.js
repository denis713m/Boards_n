import * as types from '../actionTypes';

const initialState = {
    isFetching: true,
    error: false,
    boards: [],
    currentBoard: {}    
  };

  export default function(state = initialState, action) {
    switch (action.type) {
      case types.BOARD_REQUEST:{
        state.isFetching = true;
        return {...state}
      }
      case types.BOARD_CREATE_SUCCESS:{
        return {...state,
            isFetching: false,
            boards: [...state.boards, action.data],
            error: null
        }
      }
      case types.GET_BOARDS_SUCCESS:{
        return {...state,
            isFetching: false,
            boards: [...action.data],
            error: null
        }
      }
      case types.GET_BOARD_BY_ID_SUCCESS:{
        return {...state,
            isFetching: false,
            currentBoard: action.data,
            error: null
        }
      }
      case types.BOARD_RENAME_SUCCESS:{
        return {...state,
            isFetching: false,
            currentBoard: {...state.currentBoard, name: action.data.newName},
            boards: [...action.data.boards],
            error: null
        }
      }
      case types.BOARD_DELETE_SUCCESS:{
        return {...state,
            isFetching: false,
            currentBoard: {},
            boards: [...action.data.boards],
            error: null
        }
      }
      case types.BOARD_OPERATION_ERROR:{
        return {
          ...state,
          isFetching: false,
          error: action.error,          
        }
      }
      default:
        return state;
    }
}