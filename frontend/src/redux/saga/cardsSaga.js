import * as types from '../actionTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { select } from 'redux-saga/effects';
import { saveCardToStorage, getCardsFromStorage } from '../../utils/functions';

export function* createCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { card } = yield select();
        card.cards.forEach((card) => {
            if (card.name === action.payload.name) throw new Error('Wrong name');
        });
        const newCard = {
            name: action.payload.name,
            userId: action.payload.user,
            id: uuidv4(),
            listId: action.payload.list,
            boardId: action.payload.board,
        };
        saveCardToStorage(newCard);
        yield put({
            type: types.CARD_CREATE_SUCCESS,
            data: newCard,
        });
    } catch (e) {
        console.log(e);
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e,
        });
    }
}

export function* deleteCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const cards = getCardsFromStorage();
        const newCards = cards.filter((element) => element.id !== action.payload.card);
        window.localStorage.setItem('cards', JSON.stringify(newCards));
        const { card } = yield select();
        const stateCard = card.cards.filter((element) => element.id !== action.payload.card);
        yield put({
            type: types.CARD_DELETE_SUCCESS,
            data: stateCard,
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.response,
        });
    }
}
