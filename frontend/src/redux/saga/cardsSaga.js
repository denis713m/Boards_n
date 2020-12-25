import * as types from '../actionTypes';
import * as activitiTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import _ from 'lodash';
import moment from 'moment';
import { stopSubmit } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import * as request from '../../api/fetchApi';

export function* createCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { name, listId, boardId, userId, list, authorInfo } = action.payload;
        const { card, boards } = yield select();
        const sameNameCard = _.find(card.cards, { name });
        if (!_.isUndefined(sameNameCard)) throw new Error('Name exists');
        const { data } = yield request.createCard({ name, listId, boardId });
        yield put({
            type: types.CARD_CREATE_SUCCESS,
            data: { name, userId, listId, boardId, index: data.index, id: data.id },
            activity: {
                id: `${boards.activities.length}activity`,
                type: activitiTypes.CREATE_CARD,
                Card: { name },
                List: { name: list },
                boardId,
                User: authorInfo,
                cardId: data.id,
                time: moment(),
            },
        });
        action.payload.showCreateCardForm(false);
    } catch (e) {
        if (e.message === 'Name exists' || (e.response && e.response.data === 'Name exists'))
            yield put(stopSubmit('createCard', { name: ERROR_MESSAGES.CARD_EXIST }));
        else yield put(stopSubmit('createCard', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.CARD_OPERATION_ERROR,
        });
    }
}

export function* deleteCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { removeCard } = action.payload;
        const { id, index, listId, boardId, name } = removeCard;
        yield request.deleteCard({ id, index, listId, boardId, name });
        const { card, boards } = yield select();
        const stateCard = card.cards.filter((element) => element.id !== id);
        const cardsToDecreaseIndex = stateCard.filter((element) => element.listId === listId && element.index > index);
        cardsToDecreaseIndex.forEach((element) => (element.index = element.index - 1));
        yield put({
            type: types.CARD_DELETE_SUCCESS,
            data: stateCard,
            activity: {
                id: `${boards.activities.length}activity`,
                type: activitiTypes.DELETE_CARD,
                name,
                List: { name: action.payload.list },
                boardId,
                User: action.payload.authorInfo,
                time: moment(),
            },
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: ERROR_MESSAGES.default,
        });
    }
}

export function* createComment(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { card, comment } = action.payload;
        const { id, boardId, listId } = card;
        yield request.createComment({ cardId: id, boardId, listId, name: comment });
        const { boards } = yield select();
        yield put({
            type: types.ADD_COMMENT_SUCCESS,
            activity: {
                id: `${boards.activities.length}activity`,
                type: activitiTypes.ADD_COMMENT,
                Card: { name: card.name },
                name: comment,
                boardId,
                User: action.payload.authorInfo,
                time: moment(),
                cardId: id,
            },
        });
    } catch (e) {
        yield put(stopSubmit('createComment', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.CARD_OPERATION_ERROR,
        });
    }
}

export function* addDescription(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        yield request.addDescription({ id: action.payload.cardId, description: action.payload.description });
        const { card } = yield select();
        const stateCard = _.find(card.cards, { id: action.payload.cardId });
        stateCard.description = action.payload.description;
        yield put({
            type: types.CARD_ADD_DESCRIPTION_SUCCESS,
            data: card.cards,
            description: action.payload.description,
        });
    } catch (e) {
        if (e.message === 'NO_RIGHTS') yield put(stopSubmit('createDescription', { name: ERROR_MESSAGES.NO_RIGHTS }));
        else yield put(stopSubmit('createDescription', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.CARD_OPERATION_ERROR,
        });
    }
}

export function* replaceCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { cardId, newListId, oldListId, oldIndex, newIndex, boardId } = action.payload;
        const { list, card, boards } = yield select();
        const oldList = _.find(list.lists, { id: oldListId }).name;
        const newList = _.find(list.lists, { id: newListId }).name;
        const cardsToDecreaseIndex = card.cards.filter(
            (card) => card.listId === oldListId && card.id !== cardId && card.index > oldIndex
        );
        const cardsToIncreaseIndex = card.cards.filter(
            (card) => card.listId === newListId && card.id !== cardId && card.index >= newIndex
        );
        const cardToReplace = _.find(card.cards, { id: cardId });
        cardsToDecreaseIndex.forEach((card) => (card.index = card.index - 1));
        cardsToIncreaseIndex.forEach((card) => (card.index = card.index + 1));
        cardToReplace.index = newIndex;
        cardToReplace.listId = newListId;
        const newCards = _.sortBy(card.cards, ['index']);
        yield put({
            type: types.CARD_REPLACE_SUCCESS,
            data: newCards,
        });
        try {
            yield request.replaceCard({ cardId, newListId, oldListId, oldIndex, newIndex, boardId });
            yield put({
                type: types.CARD_REPLACE_SUCCESS_ADD_ACTIVITY,
                activity: {
                    id: `${boards.activities.length}activity`,
                    type: activitiTypes.REPLACE_CARD,
                    Card: { name: cardToReplace.name },
                    User: action.payload.authorInfo,
                    boardId,
                    cardId,
                    time: moment(),
                    List: { name: newList },
                    List_sourceList: { name: oldList },
                },
            });
        } catch (e) {
            cardsToDecreaseIndex.forEach((card) => (card.index = card.index + 1));
            cardsToIncreaseIndex.forEach((card) => (card.index = card.index - 1));
            cardToReplace.index = oldIndex;
            cardToReplace.listId = oldListId;
            const newCards = _.sortBy(card.cards, ['index']);
            yield put({
                type: types.CARD_REPLACE_SUCCESS,
                data: newCards,
            });
        }
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: ERROR_MESSAGES.default,
        });
    }
}

export function* replaceCardInList(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { cardId, listId, oldIndex, newIndex, boardId } = action.payload;
        const { card } = yield select();
        const cardsToDecreaseIndex = card.cards.filter(
            (card) => card.listId === listId && card.id !== cardId && card.index > oldIndex && card.index <= newIndex
        );
        const cardsToIncreaseIndex = card.cards.filter(
            (card) => card.listId === listId && card.id !== cardId && card.index < oldIndex && card.index >= newIndex
        );
        const cardToReplace = _.find(card.cards, { id: cardId });
        cardsToDecreaseIndex.forEach((card) => (card.index = card.index - 1));
        cardsToIncreaseIndex.forEach((card) => (card.index = card.index + 1));
        cardToReplace.index = newIndex;
        const newCards = _.sortBy(card.cards, ['index']);
        yield put({
            type: types.CARD_REPLACE_IN_LIST_SUCCESS,
            data: newCards,
        });
        try {
            yield request.replaceCardInList(action.payload);
        } catch (e) {
            cardsToDecreaseIndex.forEach((card) => (card.index = card.index + 1));
            cardsToIncreaseIndex.forEach((card) => (card.index = card.index - 1));
            cardToReplace.index = action.payload.oldIndex;
            const newCards = _.sortBy(card.cards, ['index']);
            yield put({
                type: types.CARD_REPLACE_IN_LIST_SUCCESS,
                data: newCards,
            });
            throw e;
        }
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: ERROR_MESSAGES.default,
        });
    }
}
