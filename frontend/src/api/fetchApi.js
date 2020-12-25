import http from './interceptors';

export const registerRequest = (userInfo) => http.post('registration', userInfo);
export const loginRequest = (userInfo) => http.post('login', userInfo);
export const getUserRequest = () => http.post('getUser');
export const createBoard = (data) => http.post('createBoard', data);
export const deleteBoards = (data) => http.post('deleteBoard', data);
export const renameBoards = (data) => http.post('renameBoard', data);
export const getAllBoards = () => http.post('getAllBoards');
export const getBoardByIds = (data) => http.post('getBoardById', data);
export const createList = (data) => http.post('createList', data);
export const renameList = (data) => http.post('renameList', data);
export const deleteList = (data) => http.post('deleteList', data);
export const createCard = (data) => http.post('createCard', data);
export const deleteCard = (data) => http.post('deleteCard', data);
export const addDescription = (data) => http.post('addDescription', data);
export const replaceCard = (data) => http.post('replaceCard', data);
export const replaceCardInList = (data) => http.post('replaceCardInList', data);
export const createComment = (data) => http.post('createComment', data);