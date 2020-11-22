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
        console.log('board_request');
        state.isFetching = true;
        return {...state}
      }
      case types.BOARD_CREATE_SUCCESS:{
        console.log('board_creation_sucess');
        console.log(action.data)
        return {...state,
            isFetching: false,
            boards: [...state.boards, action.data],
            error: null
        }
      }
      case types.GET_BOARDS_SUCCESS:{
        console.log('get_board_sucess');
        return {...state,
            isFetching: false,
            boards: [...action.data],
            error: null
        }
      }
      case types.GET_BOARD_BY_ID_SUCCESS:{
        console.log('get_board_by_id_success');
        return {...state,
            isFetching: false,
            currentBoard: action.data,
            error: null
        }
      }
      case types.BOARD_RENAME_SUCCESS:{
        console.log('rename_board_by_id_success');
        return {...state,
            isFetching: false,
            currentBoard: {...state.currentBoard, name: action.data.newName},
            boards: [...action.data.boards],
            error: null
        }
      }
      case types.BOARD_OPERATION_ERROR:{
        console.log('error');
        console.log(action.error);
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