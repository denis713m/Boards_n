import * as types from '../actionTypes';
import * as activitiTypes from '../../utils/activityTypes';
import { put } from 'redux-saga/effects';
import { select } from 'redux-saga/effects';
import _ from 'lodash';
import { stopSubmit } from 'redux-form';
import ERROR_MESSAGES from '../../ERROR_CONSTANTS';
import server from '../../serverEmulator/server';

export function* createCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { card } = yield select();
        const sameNameCard = _.find(card.cards, { name: action.payload.name });
        if (!_.isUndefined(sameNameCard)) throw new Error('CARD_EXIST');
        const { index, id, activityId, activityTime } = yield server.createCard(action.payload);
        yield put({
            type: types.CARD_CREATE_SUCCESS,
            data: {
                name: action.payload.name,
                userId: action.payload.user,
                listId: action.payload.listId,
                boardId: action.payload.board,
                index: index,
                id: id,
            },
            activity: {
                activity: {
                    type: activitiTypes.CREATE_CARD,
                    card: action.payload.name,
                    list: action.payload.list,
                },
                id: activityId,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                cardId: id,
                time: activityTime,
            },
        });
        action.payload.showCreateCardForm(false);
    } catch (e) {
        if (e.message === 'CARD_EXIST') yield put(stopSubmit('createCard', { name: ERROR_MESSAGES.CARD_EXIST }));
        else yield put(stopSubmit('createCard', { name: ERROR_MESSAGES.default }));
        yield put({
            type: types.CARD_OPERATION_ERROR,
        });
    }
}

export function* deleteCard(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const activity = yield server.deleteCard(action.payload);
        const { card } = yield select();
        const stateCard = card.cards.filter((element) => element.id !== action.payload.card);
        const deletedCard = _.find(card.cards, { id: action.payload.card });
        const cardsToDecreaseIndex = stateCard.filter(
            (element) => element.listId === deletedCard.listId && element.index > deletedCard.index
        );
        cardsToDecreaseIndex.forEach((element) => (element.index = element.index - 1));
        yield put({
            type: types.CARD_DELETE_SUCCESS,
            data: stateCard,
            activity: {
                activity: {
                    type: activitiTypes.DELETE_CARD,
                    card: action.payload.name,
                    list: action.payload.list,
                },
                id: activity.id,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: activity.time,
            },
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}

export function* createComment(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const activity = yield server.createComment(action.payload);
        yield put({
            type: types.ADD_COMMENT_SUCCESS,
            activity: {
                activity: {
                    type: activitiTypes.ADD_COMMENT,
                    card: action.payload.name,
                    comment: action.payload.comment,
                },
                id: activity.id,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: activity.time,
                cardId: action.payload.cardId,
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
        yield server.addDescription(action.payload);
        const { card } = yield select();
        const stateCard = _.find(card.cards, { id: action.payload.card, userId: action.payload.user });
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
        const { list, card } = yield select();
        const oldList = _.find(list.lists, { id: action.payload.oldListId }).name;
        const newList = _.find(list.lists, { id: action.payload.newListId }).name;
        const activity = yield server.replaceCard({ ...action.payload, oldList, newList });
        const cardsToDecreaseIndex = card.cards.filter(
            (card) =>
                card.listId === action.payload.oldListId &&
                card.id !== action.payload.cardId &&
                card.index > action.payload.oldIndex
        );
        const cardsToIncreaseIndex = card.cards.filter(
            (card) =>
                card.listId === action.payload.newListId &&
                card.id !== action.payload.cardId &&
                card.index >= action.payload.newIndex
        );
        const cardToReplace = _.find(card.cards, { id: action.payload.cardId });
        cardsToDecreaseIndex.forEach((card) => (card.index = card.index - 1));
        cardsToIncreaseIndex.forEach((card) => (card.index = card.index + 1));
        cardToReplace.index = action.payload.newIndex;
        cardToReplace.listId = action.payload.newListId;
        const newCards = _.sortBy(card.cards, ['index']);
        yield put({
            type: types.CARD_REPLACE_SUCCESS,
            data: newCards,
            activity: {
                activity: {
                    type: activitiTypes.REPLACE_CARD,
                    card: cardToReplace.name,
                    newList: newList,
                    oldList: oldList,
                },
                id: activity.id,
                userId: action.payload.user,
                boardId: action.payload.board,
                authorInfo: action.payload.authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
                time: activity.time,
                cardId: action.payload.cardId,
            },
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}

export function* replaceCardInList(action) {
    yield put({ type: types.CARD_REQUEST });
    try {
        const { card } = yield select();
        yield server.replaceCardInList({ ...action.payload });
        const cardsToDecreaseIndex = card.cards.filter(
            (card) =>
                card.listId === action.payload.listId &&
                card.id !== action.payload.cardId &&
                card.index > action.payload.oldIndex &&
                card.index <= action.payload.newIndex
        );
        const cardsToIncreaseIndex = card.cards.filter(
            (card) =>
                card.listId === action.payload.listId &&
                card.id !== action.payload.cardId &&
                card.index < action.payload.oldIndex &&
                card.index >= action.payload.newIndex
        );
        const cardToReplace = _.find(card.cards, { id: action.payload.cardId });
        cardsToDecreaseIndex.forEach((card) => (card.index = card.index - 1));
        cardsToIncreaseIndex.forEach((card) => (card.index = card.index + 1));
        cardToReplace.index = action.payload.newIndex;
        const newCards = _.sortBy(card.cards, ['index']);
        yield put({
            type: types.CARD_REPLACE_IN_LIST_SUCCESS,
            data: newCards,
        });
    } catch (e) {
        yield put({
            type: types.CARD_OPERATION_ERROR,
            error: e.message,
        });
    }
}
