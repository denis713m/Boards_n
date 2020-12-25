const db = require('../models');

module.exports.createActivity = async (data) => {
    console.log(data);
    const newActivity = await db.Activity.create(data);
    if (!newActivity) {
        throw new Error('Cant create activity');
    }
    return newActivity.get({ plain: true });
};
