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

export const getListsFromStorage = (boardId) => {
    return JSON.parse(window.localStorage.getItem('lists') || '[]');    
}