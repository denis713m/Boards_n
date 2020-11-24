export const getBoardsFromStorage = () => {
    return JSON.parse(window.localStorage.getItem('boards') || '[]')
}