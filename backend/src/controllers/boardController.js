const boardQueries = require('../queries/boardQueries');

module.exports.createBoard = async (req, res) => {
    const name = req.body.name;
    const user = req.tokenData.userId;
    const newBoard = await boardQueries.createBoard({name, user});
    res.send(`${newBoard.id}`);
};

module.exports.deleteBoard = async (req, res) => {
    const id = req.body.id;
    const user = req.tokenData.userId;
    await boardQueries.deleteBoard({ id, user });
    res.end();
};

module.exports.getAllBoards = async (req, res) => {
    const allBoards = await boardQueries.getAllBoards();
    res.send(allBoards);
};

module.exports.renameBoard = async (req, res) => {
    const id = req.body.id;
    const newName = req.body.newName;
    const user = req.tokenData.userId;
    await boardQueries.renameBoard(id, user, newName);
    res.end();
};

module.exports.getBoardById = async (req, res) => {
    const id = req.body.id;
    const board = await boardQueries.getBoardById(id);
    res.send(board);
};
