import * as types from '../actionTypes';
import * as activitiTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import { select } from 'redux-saga/effects';
import { saveCardToStorage, getCardsFromStorage, writeActivity } from '../../utils/storageFunctions';

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
            listId: action.payload.listId,
            boardId: action.payload.board,
        };
        saveCardToStorage(newCard);
        const activity = writeActivity(
            {
                type: activitiTypes.CREATE_CARD,
                card: action.payload.name,
                list: action.payload.list,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo,
            newCard.id
        );
        yield put({
            type: types.CARD_CREATE_SUCCESS,
            data: newCard,
            activity: activity,
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
        const activity = writeActivity(
            {
                type: activitiTypes.DELETE_CARD,
                card: action.payload.name,
                list: action.payload.list,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo
        );
        const { card } = yield select();
        const stateCard = card.cards.filter((element) => element.id !== action.payload.card);
        yield put({
            type: types.CARD_DELETE_SUCCESS,
            data: stateCard,
            activity: activity,
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.response,
        });
    }
}

export function* createComment(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const activity = writeActivity(
            {
                type: activitiTypes.ADD_COMMENT,
                card: action.payload.name,
                comment: action.payload.comment,
            },
            action.payload.user,
            action.payload.board,
            action.payload.authorInfo,
            action.payload.cardId
        );
        yield put({
            type: types.ADD_COMMENT_SUCCESS,
            activity: activity,
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.response,
        });
    }
}

export function* addDescription(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const cards = getCardsFromStorage();
        cards.forEach((element) => {
            if (element.id === action.payload.card && element.userId === action.payload.user)
                element.description = action.payload.description;
        });
        window.localStorage.setItem('cards', JSON.stringify(cards));
        const { card } = yield select();
        card.cards.forEach((element) => {
            if (element.id === action.payload.card && element.userId === action.payload.user)
                element.description = action.payload.description;
        });
        yield put({
            type: types.CARD_ADD_DESCRIPTION_SUCCESS,
            data: card.cards,
            description: action.payload.description
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.response,
        });
    }
}
