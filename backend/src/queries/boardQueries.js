const db = require('../models');

module.exports.createBoard = async (data) => {
    const newBoard = await db.Board.create(data);
    if (!newBoard) {
        throw new Error('Cant create user');
    }
    return newBoard.get({ plain: true });
};

module.exports.deleteBoard = async (data) => {
    const deletedRows = await db.Board.destroy({ where: data });
    if (deletedRows === 0) {
        throw new Error('Deleted problems');
    }
};

module.exports.getAllBoards = async () => {
    const boards = await db.Board.findAll({ raw: true });
    return boards;
};

module.exports.renameBoard = async (id, user, newName) => {
    const [updatedRows] = await db.Board.update({ name: newName }, { where: { id: id, user: user } });
    if (updatedRows === 0) {
        throw new Error('Rename problems');
    }
};

module.exports.getBoardById = async (id) => {
    const board = await db.Board.findOne({
        where: { id: id },
        order: [
            [db.List, 'id', 'asc'],
            [db.Card, 'index', 'asc'],
            [db.Activity, 'id', 'desc'],
        ],
        include: [
            {
                model: db.List,
            },
            {
                model: db.Card,
            },
            {
                model: db.Activity,
                include: [
                    {
                        model: db.User,
                        attributes: [['firstName', 'name'], 'email'],
                    },
                    {
                        model: db.List,
                        as: 'List',
                        attributes: ['name'],
                    },
                    {
                        model: db.List,
                        as: 'List_sourceList',
                        attributes: ['name'],
                    },
                    {
                        model: db.Card,
                        attributes: ['name'],
                    },
                ],
                attributes: {
                    exclude: ['userId'],
                },
            },
        ],
    });
    if (board.length === 0) throw new Error('Board_absend');
    return board.get({ plain: true });
};
