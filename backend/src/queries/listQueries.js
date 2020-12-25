const db = require('../models');
const { Op } = require('sequelize');

module.exports.createList = async (data) => {
    const newList = await db.List.create(data);
    if (!newList) {
        throw new Error('Cant create user');
    }
    return newList.get({ plain: true });
};

module.exports.renameList = async (newName, id, userId) => {
    const [updatedRows, [renamedList]] = await db.List.update(
        { name: newName },
        { where: { id: id, [Op.or]: [{ userId }, { boardAuthor: userId }] }, returning: true }
    );
    if (updatedRows === 0) {
        throw new Error('NO_RIGHTS');
    }
    return renamedList.dataValues;
};

module.exports.deleteList = async (data, userId) => {
    const deletedRows = await db.List.destroy({ where: { ...data, [Op.or]: [{ userId }, { boardAuthor: userId }] } });
    if (deletedRows === 0) {
        throw new Error('NO_RIGHTS');
    }
};
