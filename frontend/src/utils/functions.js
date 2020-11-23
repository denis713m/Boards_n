export const getBoardsFromStorage = () => {
    let boards = window.localStorage.getItem('boards');
    if(!boards) boards = [];
    else boards = JSON.parse(boards);
    return boards;
}