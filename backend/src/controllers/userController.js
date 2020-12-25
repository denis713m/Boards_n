const db = require('../models');
const generateTokens = require('../middleware/tokenMiddleware');
const passwordMiddleware = require('../middleware/password');
const userQuerie = require('../queries/usersQueries');

module.exports.registrationUser = async (req, res) => {
    const user = req.body;
    user.password = req.hashPass;  
    const newUser = await userQuerie.createUser({ ...user });  
    const tokens = generateTokens.generateTokens(newUser);
    await userQuerie.updateUserTokens(tokens, newUser.id);
    res.send({ ...tokens, id: newUser.id });
};

module.exports.loginUser = async (req, res) => {
    const user = await userQuerie.loginUser(req.body.email);
    await passwordMiddleware.passwordCompare(req.body.password, user.password);
    const tokens = generateTokens.generateTokens(user);
    await userQuerie.updateUserTokens(tokens, user.id);
    res.send({
        firstName: user.firstName,
        userId: user.id,
        lastName: user.lastName,
        displayName: user.displayName,
        accessToken: tokens.accessToken,
        email: user.email,
    });
};

module.exports.getUser = async (req, res) => {  
    const userId = req.tokenData.userId;
    const user = await userQuerie.getUser(userId);
    res.send({
        firstName: user.firstName,
        userId: user.id,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
    });
};
