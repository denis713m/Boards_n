const cardQueries = require('../queries/cardQueries');
const activityQueries = require('../queries/activityQueries');
const CONSTANTS = require('../CONSTANTS');

module.exports.createCard = async (req, res) => {
    const name = req.body.name;
    const userId = req.tokenData.userId;
    const listId = req.body.listId;
    const boardId = req.body.boardId;
    const card = await cardQueries.createCard({ name, userId, listId, boardId });
    await activityQueries.createActivity({
        type: CONSTANTS.activityTypes.CREATE_CARD,
        name,
        userId,
        listId,
        boardId,
        cardId: card.id,
    });
    res.send({ id: card.id, index: card.index });
};

module.exports.deleteCard = async (req, res) => {
    const id = req.body.id;
    await cardQueries.deleteCard({ id });
    const index = req.body.index;
    const listId = req.body.listId;
    await cardQueries.updateIndexOnCardDelete(index, { listId });
    const userId = req.tokenData.userId;
    const boardId = req.body.boardId;
    const name = req.body.name;
    await activityQueries.createActivity(
        {
            type: CONSTANTS.activityTypes.DELETE_CARD,
            listId,
            userId,
            boardId,
            name,
        }
    );
    res.end();
};

module.exports.addDescription = async (req, res) => {
    const description = req.body.description;
    const id = req.body.id;
    await cardQueries.addDescription({ id }, { description });
    res.end();
};

module.exports.createComment = async (req, res) => {
    const { name, cardId, listId, boardId } = req.body;
    const userId = req.tokenData.userId;
    await activityQueries.createActivity({
        name,
        userId,
        listId,
        boardId,
        cardId,
        type: CONSTANTS.activityTypes.ADD_COMMENT,
    });
    res.end();
};

module.exports.replaceCard = async (req, res) => {
    const id = req.body.cardId;
    const newIndex = req.body.newIndex;
    const newListId = req.body.newListId;
    await cardQueries.replaceCard(id, newIndex, newListId);
    const oldIndex = req.body.oldIndex;
    const oldListId = req.body.oldListId;
    await cardQueries.updateIndexCardOnReplace(id, oldIndex, newIndex, oldListId, newListId);
    const userId = req.tokenData.userId;
    const boardId = req.body.boardId;
    await activityQueries.createActivity({
        type: CONSTANTS.activityTypes.REPLACE_CARD,
        cardId: id,
        listId: newListId,
        sourceList: oldListId,
        userId,
        boardId,
    });
    res.end();
};

module.exports.replaceCardInList = async (req, res) => {
    const id = req.body.cardId;
    const oldIndex = req.body.oldIndex;
    const newIndex = req.body.newIndex;
    const listId = req.body.listId;
    await cardQueries.replaceCardInList(id, oldIndex, newIndex, { listId });
    res.end();
};
