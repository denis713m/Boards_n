import * as types from '../actionTypes';

const initialState = {
    isFetching: false,
    error: false,
    user: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.REGISTRATION_USER_REQUEST: {
            return { ...state, isFetching: true, error: false };
        }
        case types.REGISTRATION_USER_SUCCESS: {
            state.user = action.data;
            state.isFetching = false;
            return { ...state, isFetching: false, user: action.data, error: null };
        }
        case types.REGISTRATION_USER_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
                user: null,
            };
        }
        case types.LOG_OUT: {

            return {
                ...state,
                isFetching: false,
                error: null,
                user: null,
            };
        }
        default:
            return state;
    }
}
