export const getBoardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('boards') || '[]')
}

export const getListsFromStorageByBoard = (boardId) => {
    const lists = JSON.parse(window.localStorage.getItem('lists') || '[]');
    const boardLists = lists.filter(list => list.boardId === boardId)
    return boardLists;
}

export const saveListToStorage = (newList) => {
    const lists = JSON.parse(window.localStorage.getItem('lists') || '[]');
    lists.push(newList);
    window.localStorage.setItem('lists', JSON.stringify(lists));
}

export const getListsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]');    
}

export const saveCardToStorage = (newCard) => {
    const cards = JSON.parse(window.localStorage.getItem('cards') || '[]');
    cards.push(newCard);
    window.localStorage.setItem('cards', JSON.stringify(cards));
}

export const getCardsFromStorageByBoard = (boardId) => {
    const cards = JSON.parse(window.localStorage.getItem('cards') || '[]');
    const boardCards = cards.filter(card => card.boardId === boardId)
    return boardCards;
}

export const getCardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('cards') || '[]');    
}