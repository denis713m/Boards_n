const db = require('../models');

module.exports.updateUserTokens = async (data, userId) => {
  const [updatedCount] = await db.User.update(
      { accessToken: data.accessToken, refreshToken: data.refreshToken },
      { where: { id: userId }});
};

module.exports.createUser = async (data) => {
  const newUser = await db.User.create(data);
  return newUser.get({ plain: true }); 
};

module.exports.loginUser = async (data) => {
  const newUser = await db.User.findOne({where:{email: data}});
  if (!newUser) {
    throw new Error('Cant find user');
  }
  return newUser.get({ plain: true }); 
};

module.exports.getUser = async (data) => {
  const newUser = await db.User.findOne({where:{id: data}});
  if (!newUser) {
    throw new Error('Cant find user');
  }
  return newUser.get({ plain: true }); 
};