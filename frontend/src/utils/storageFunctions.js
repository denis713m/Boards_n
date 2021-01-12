import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';

export const registerUser = (data) => {
    const users = getUsersFromStorage();
    const user = _.find(users, { email: data.email });
    if (!_.isUndefined(user)) throw new Error('EMAIL_BUSY');
    const userId = uuidv4();
    users.push({ ...data, userId });
    window.localStorage.setItem('users', JSON.stringify(users));
    return userId;
};

export const getUserByEmail = (email) => {
    const users = getUsersFromStorage();
    const user = _.find(users, { email: email });
    if (_.isUndefined(user)) throw new Error('NOT_EXIST');
    return user;
};

export const getUserById = (userId) => {
    const users = getUsersFromStorage();
    const user = _.find(users, { userId: userId });
    if (_.isUndefined(user)) throw new Error('Server error');
    return user;
};

export const updateUserToken = (userId, token) => {
    const users = getUsersFromStorage();
    const user = _.find(users, { userId: userId });
    user.token = token;
    window.localStorage.setItem('users', JSON.stringify(users));
};

export const getBoardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('boards') || '[]');
};

export const saveBoardToStorage = (board) => {
    const boards = JSON.parse(window.localStorage.getItem('boards') || '[]');
    const boardWithNewName = _.find(boards, { name: board.name });
    if (!_.isUndefined(boardWithNewName)) throw new Error('Name exists');
    const newBoardId = uuidv4();
    boards.push({ ...board, id: newBoardId });
    window.localStorage.setItem('boards', JSON.stringify(boards));
    return newBoardId;
};

export const getListsFromStorageByBoard = (boardId) => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]').filter((list) => list.boardId === boardId);
};

export const saveListToStorage = (newList) => {
    const lists = JSON.parse(window.localStorage.getItem('lists') || '[]');
    const sameNameList = _.find(lists, { name: newList.name, boardId: newList.boardId });
    if (!_.isUndefined(sameNameList)) throw new Error('LIST_EXIST');
    const newListId = uuidv4();
    lists.push({ ...newList, id: newListId });
    window.localStorage.setItem('lists', JSON.stringify(lists));
    return newListId;
};

export const getListsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]');
};

export const saveCardToStorage = (newCard) => {
    const cards = JSON.parse(window.localStorage.getItem('cards') || '[]');
    const sameNameCard = _.find(cards, { name: newCard.name, boardId: newCard.boardId });
    if (!_.isUndefined(sameNameCard)) throw new Error('CARD_EXIST');
    const cardsInList = cards.filter((card) => card.listId === newCard.listId);
    const newCardIndex = cardsInList.length;
    const newCardId = uuidv4();
    cards.push({ ...newCard, index: newCardIndex, id: newCardId });
    window.localStorage.setItem('cards', JSON.stringify(cards));
    return { index: newCardIndex, id: newCardId };
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

export const deleteListByBoard = (boardId) => {
    const lists = getListsFromStorage();
    const listsDevide = _.partition(lists, ['boardId', boardId]);
    const deletedListsId = listsDevide[0].map((list) => list.id);
    deleteCardsByList(deletedListsId);
    window.localStorage.setItem('lists', JSON.stringify(listsDevide[1]));
    const activity = JSON.parse(window.localStorage.getItem('activities') || '[]');
    const newActivity = activity.filter((activity) => activity.boardId !== boardId);
    window.localStorage.setItem('activities', JSON.stringify(newActivity));
};

export const deleteCardsByList = (listId) => {
    console.log(listId);
    const cards = getCardsFromStorage();
    const newCards = cards.filter((card) => !listId.includes(card.listId));
    window.localStorage.setItem('cards', JSON.stringify(newCards));
};

export const getUsersFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('users') || '[]');
};

export const renameBoard = (data) => {
    const boards = getBoardsFromStorage();
    const board = _.find(boards, { id: data.id, user: data.author });
    if (_.isUndefined(board)) throw new Error('Yoy cant rename this board');
    board.name = data.name;
    window.localStorage.setItem('boards', JSON.stringify(boards));
};

export const deleteBoard = (data) => {
    const boards = getBoardsFromStorage();
    const newBoards = boards.filter((element) => element.id !== data.id || element.user !== data.author);
    if (newBoards.length === boards.length) throw new Error('Yoy cant delete this board');
    window.localStorage.setItem('boards', JSON.stringify(newBoards));
};

export const renameList = (data) => {
    const lists = getListsFromStorage();
    const listWithNewName = _.find(lists, { name: data.name, boardId: data.board });
    if (!_.isUndefined(listWithNewName)) throw new Error('Name exists');
    const listToRename = _.find(lists, { id: data.listId, user: data.user });
    listToRename.name = data.name;
    window.localStorage.setItem('lists', JSON.stringify(lists));
};

export const deleteList = (data) => {
    const lists = getListsFromStorage();
    const newLists = lists.filter((element) => element.id !== data.listId);
    window.localStorage.setItem('lists', JSON.stringify(newLists));
};

export const deleteCard = (data) => {
    const cards = getCardsFromStorage();
    const deletedCard = _.find(cards, { id: data.card });
    const newCards = cards.filter((element) => element.id !== data.card);
    const cardsToDecreaseIndex = newCards.filter(
        (element) => element.listId === deletedCard.listId && element.index > deletedCard.index
    );
    cardsToDecreaseIndex.forEach((element) => (element.index = element.index - 1));
    window.localStorage.setItem('cards', JSON.stringify(newCards));
};
