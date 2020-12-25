const { Op } = require('sequelize');
const db = require('../models');

module.exports.createCard = async (data) => {
    const newCard = await db.Card.create(data, { hooks: true });
    if (!newCard) {
        throw new Error('Cant create user');
    }
    return newCard.get({ plain: true });
};

module.exports.deleteCard = async (data) => {
    const deletedCards = await db.Card.destroy({ where: data });
    if (deletedCards !== 1) throw new Error('Problem on delete');
};

module.exports.updateIndexOnCardDelete = async (index, listId) => {
    await db.Card.update(
        {
            index: db.sequelize.literal(`"index"-1`),
        },
        { where: { ...listId, index: { [Op.gt]: index } }}
    );
};

module.exports.addDescription = async (id, description) => {
    const [updatedRows] = await db.Card.update(description, { where: id });
    if (updatedRows !== 1) throw new Error('Updated error');
};

module.exports.replaceCardInList = async (id, oldIndex, newIndex, listId) => {
    const [updatedRows] = await db.Card.update(
        {
            index: db.sequelize.literal(
                `CASE
                    WHEN "id"=${id}  THEN '${newIndex}'
                    WHEN "index">'${oldIndex}' AND "index"<=${newIndex} THEN "index"-1
                    WHEN "index"<'${oldIndex}' AND "index">=${newIndex} THEN "index"+1
                    ELSE "index"
                END`
            ),
        },
        { where: listId }
    );
    if (updatedRows < 2 || updatedRows === 0) throw new Error('Updated error');
};

module.exports.replaceCard = async (id, newIndex, newListId) => {
    console.log(newListId);
    const [updateCard] = await db.Card.update(
        {
            index: newIndex,
            listId: newListId,
        },
        { where: { id: id } }
    );
    if (updateCard !== 1) throw new Error('Updated error');
};

module.exports.updateIndexCardOnReplace = async (id, oldIndex, newIndex, oldListId, newListId) => {
    await db.Card.update(
        {
            index: db.sequelize.literal(
                `CASE
                    WHEN "index">'${oldIndex}' AND "listId"=${oldListId} THEN "index"-1
                    WHEN "index">='${newIndex}' AND "listId"=${newListId} THEN "index"+1
                    ELSE "index"
                END`
            ),
        },
        { where: { listId: { [Op.or]: [oldListId, newListId] }, id: { [Op.ne]: id } } }
    );
};

module.exports.findMax = async (data) => {
    let dateStart = new Date();
    const max = await db.Card.max('index', { where: { listId: data } });
    let dateEnd = new Date();
    const maxRes = `max time ${dateEnd - dateStart} res ${max}`;
    dateStart = new Date();
    const count = await db.Card.count({ where: { listId: data } });
    dateEnd = new Date();
    const countRes = `count time ${dateEnd - dateStart} res ${count}`;
    return { max: maxRes, count: countRes };
};
