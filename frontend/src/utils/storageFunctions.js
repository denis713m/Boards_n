import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export const getBoardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('boards') || '[]');
};

export const getListsFromStorageByBoard = (boardId) => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]').filter((list) => list.boardId === boardId);
};

export const saveListToStorage = (newList) => {
    const lists = JSON.parse(window.localStorage.getItem('lists') || '[]');
    lists.push(newList);
    window.localStorage.setItem('lists', JSON.stringify(lists));
};

export const getListsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]');
};

export const saveCardToStorage = (newCard) => {
    const cards = JSON.parse(window.localStorage.getItem('cards') || '[]');
    let lastIndex = 0;
    cards.forEach((card) => {
        if (card.listId === newCard.listId && card.index >= lastIndex) lastIndex = card.index + 1;
    });
    cards.push({ ...newCard, index: lastIndex });
    window.localStorage.setItem('cards', JSON.stringify(cards));
    return lastIndex;
};

export const getCardsFromStorageByBoard = (boardId) => {
    const cards = JSON.parse(window.localStorage.getItem('cards') || '[]');
    const boardCards = cards.filter((card) => card.boardId === boardId);
    return boardCards;
};

export const getCardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('cards') || '[]');
};

export const writeActivity = (activity, userId, boardId, authorInfo, cardId) => {
    const activities = JSON.parse(window.localStorage.getItem('activities') || '[]');
    const newActivity = {
        id: uuidv4(),
        activity: activity,
        userId: userId,
        boardId: boardId,
        authorInfo: authorInfo, //temporary information about author(email, name) after using server this information will be gotten from user.table
        time: moment().format('YYYY-MM-DD HH:mm'),
    };
    if (cardId) newActivity.cardId = cardId;
    activities.splice(0, 0, newActivity);
    window.localStorage.setItem('activities', JSON.stringify(activities));
    return newActivity;
};

export const getActivityFromStorageByBoard = (boardId) => {
    const activity = JSON.parse(window.localStorage.getItem('activities') || '[]');
    const boardActivities = activity.filter((list) => list.boardId === boardId);
    return boardActivities;
};

export const deleteCardsByList = (listId) => {
    const cards = getCardsFromStorage();
    const newCards = cards.filter((card) => !listId.includes(card.listId));
    window.localStorage.setItem('cards', JSON.stringify(newCards));
};

export const deleteListByBoard = (boardId) => {
    const lists = getListsFromStorage();
    const deletedLists = [];
    const newLists = lists.filter((list) => {
        if (list.boardId === boardId) {
            deletedLists.push(list.id);
            return false;
        } else return true;
    });
    deleteCardsByList(deletedLists);
    window.localStorage.setItem('lists', JSON.stringify(newLists));
    const activity = JSON.parse(window.localStorage.getItem('activities') || '[]');
    const newActivity = activity.filter((activity) => activity.boardId !== boardId);
    window.localStorage.setItem('activities', JSON.stringify(newActivity));
};
