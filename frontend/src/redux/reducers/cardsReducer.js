import * as types from '../actionTypes';

const initialState = {
    isFetching: true,
    error: false,
    cards: [],
    currentCard: {},
};

export default function (state = initialState, action) {
    switch (action.type) {
        case types.CARD_REQUEST: {
            state.isFetching = true;
            return { ...state };
        }
        case types.CARD_CREATE_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                cards: [...state.cards, action.data],
                error: null,
            };
        }
        case types.GET_CARDS_BY_BOARD_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                cards: [...action.data],
                error: null,
            };
        }
        case types.CHOOSE_CARD: {
            return {
                ...state,
                currentCard: action.payload,
            };
        }
        case types.CARD_DELETE_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                cards: [...action.data],
                currentCard: {},
                error: null,
            };
        }
        case types.CARD_OPERATION_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
            };
        }
        default:
            return state;
    }
}
