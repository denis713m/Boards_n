import _ from 'lodash';
import jwt from 'jsonwebtoken';
import * as activityTypes from '../utils/activityTypes';
import CONSTANTS from './CONSTANTS';
import { hashPass, passwordCompare } from './password';
import { generateTokens } from './generateTokens';
import {
    registerUser,
    getUserByEmail,
    updateUserToken,
    getUserById,
    saveBoardToStorage,
    getBoardsFromStorage,
    getListsFromStorageByBoard,
    getCardsFromStorageByBoard,
    getActivityFromStorageByBoard,
    renameBoard,
    deleteBoard,
    deleteListByBoard,
    saveListToStorage,
    deleteCardsByList,
    renameList,
    deleteList,
    saveCardToStorage,
    getCardsFromStorage,
    writeActivity,
    deleteCard,
} from '../utils/storageFunctions';

export default {
    registrationUser: (data) =>{
        const password = hashPass(data.password);
        const token = generateTokens(newUser);
        const newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: data.displayName,
            email: data.email,
            password: password, 
            token: token
        };
        const userId = registerUser(newUser);        
        return {token, };
    },

    login: (data) =>{
        const user = getUserByEmail(data.email);
        passwordCompare(data.password, user.password);
        const token = generateTokens(user);
        updateUserToken(user.userId, token);
        delete user.password;
        return user;
    },

    getUser: (data) =>{
        const tokenData = jwt.verify(data, CONSTANTS.SECRET_FOR_TOKEN);
        const user = getUserById(tokenData.userId);
        delete user.password;
        return user;
    },

    createBoard: (data) => {
        const board = {
            name: data.name,
            user: data.user,
        };
        const boardId = saveBoardToStorage(board);
        return boardId;
    },

    getBoards: () => getBoardsFromStorage(),

    getBoardById: (data) => {
        const boards = getBoardsFromStorage();
        const board = _.find(boards, { id: data });
        if (_.isUndefined(board)) throw new Error('Board_absend');
        const lists = getListsFromStorageByBoard(data);
        const cards = getCardsFromStorageByBoard(data);
        const activities = getActivityFromStorageByBoard(data);
        return { board, lists, cards, activities };
    },

    renameBoard: (data) => renameBoard(data),

    deleteBoard: (data) => {
        deleteBoard(data);
        console.log(data);
        deleteListByBoard(data.id);
    },

    createList: (data) => {
        const newList = {
            name: data.name,
            user: data.user,
            boardId: data.board,
        };
        const listId = saveListToStorage(newList);
        const activity = writeActivity(
            {
                type: activityTypes.CREATE_LIST,
                list: data.name,
            },
            data.user,
            data.board,
            data.authorInfo
        );
        return { listId, activityId: activity.id, activityTime: activity.time };
    },

    deleteList: (data) => {
        deleteList(data);
        deleteCardsByList([data.listId]);
        const activity = writeActivity(
            {
                type: activityTypes.DELETE_LIST,
                list: data.list,
            },
            data.user,
            data.board,
            data.authorInfo
        );
        return { id: activity.id, time: activity.time };
    },

    renameList: (data) => {
        renameList(data);
        const activity = writeActivity(
            {
                type: activityTypes.RENAME_LIST,
                list: data.list,
                newName: data.name,
            },
            data.user,
            data.board,
            data.authorInfo
        );
        return { id: activity.id, time: activity.time };
    },

    createCard: (data) => {
        const newCard = {
            name: data.name,
            userId: data.user,
            listId: data.listId,
            boardId: data.board,
        };
        const { index, id } = saveCardToStorage(newCard);
        const activity = writeActivity(
            {
                type: activityTypes.CREATE_CARD,
                card: data.name,
                list: data.list,
            },
            data.user,
            data.board,
            data.authorInfo,
            id
        );
        return { index, id, activityId: activity.id, activityTime: activity.time };
    },

    deleteCard: (data) => {
        deleteCard(data);
        const activity = writeActivity(
            {
                type: activityTypes.DELETE_CARD,
                card: data.name,
                list: data.list,
            },
            data.user,
            data.board,
            data.authorInfo
        );
        return { id: activity.id, time: activity.time };
    },

    replaceCard: (data) => {
        const cards = getCardsFromStorage();
        const cardsToDecreaseIndex = cards.filter(
            (card) => card.listId === data.oldListId && card.id !== data.cardId && card.index > data.oldIndex
        );
        const cardsToIncreaseIndex = cards.filter(
            (card) =>
                card.listId === data.newListId &&
                card.id !== data.cardId &&
                (data.newListId === data.oldListId ? card.index > data.newIndex : card.index >= data.newIndex)
        );
        const cardToReplace = _.find(cards, { id: data.cardId });
        cardsToDecreaseIndex.forEach((card) => (card.index = card.index - 1));
        cardsToIncreaseIndex.forEach((card) => (card.index = card.index + 1));
        cardToReplace.index = data.newIndex;
        cardToReplace.listId = data.newListId;
        window.localStorage.setItem('cards', JSON.stringify(cards));
        if (data.oldListId !== data.newListId) {
            const newActivity = writeActivity(
                {
                    type: activityTypes.REPLACE_CARD,
                    card: cardToReplace.name,
                    newList: data.newList,
                    oldList: data.oldList,
                },
                data.user,
                data.board,
                data.authorInfo,
                data.cardId
            );
            return { id: newActivity.id, time: newActivity.time };
        }
        return true;
    },

    addDescription: (data) => {
        const cards = getCardsFromStorage();
        const storageCard = _.find(cards, { id: data.card, userId: data.user });
        if (_.isUndefined(storageCard)) throw new Error('NO_RIGHTS');
        storageCard.description = data.description;
        window.localStorage.setItem('cards', JSON.stringify(cards));
    },

    createComment: (data) => {
        const activity = writeActivity(
            {
                type: activityTypes.ADD_COMMENT,
                card: data.name,
                comment: data.comment,
            },
            data.user,
            data.board,
            data.authorInfo,
            data.cardId
        );
        return { id: activity.id, time: activity.time };
    },
};
