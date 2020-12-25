const listQueries = require('../queries/listQueries');
const activityQueries = require('../queries/activityQueries');
const CONSTANTS = require('../CONSTANTS');

module.exports.createList = async (req, res) => {
    const {name, boardId, boardAuthor} = req.body;
    const userId = req.tokenData.userId;    
    const list = await listQueries.createList({ name, userId, boardId, boardAuthor });
    await activityQueries.createActivity({
        type: CONSTANTS.activityTypes.CREATE_LIST,
        name,
        userId,
        boardId,
        listId: list.id,
    });
    res.send({ id: list.id });
};

module.exports.renameList = async (req, res) => {
    const {id, newName, oldName} = req.body;    
    const userId = req.tokenData.userId;
    const updatedList = await listQueries.renameList(newName, id, userId);    
    await activityQueries.createActivity({
        type: CONSTANTS.activityTypes.RENAME_LIST,
        userId,
        boardId: updatedList.boardId,
        listId: updatedList.id,
        name: oldName,
    });
    res.end();
};

module.exports.deleteList = async (req, res) => {
    const {id, boardId, name} = req.body;
    const userId = req.tokenData.userId;
    await listQueries.deleteList({ id }, userId);    
    await activityQueries.createActivity({
        type: CONSTANTS.activityTypes.DELETE_LIST,
        userId,
        boardId,
        name,
    });
    res.end();
};
