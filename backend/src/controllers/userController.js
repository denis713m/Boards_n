'use strict';
const db = require('../models');
const generateTokens = require('../middleware/generateTokens');
const passwordMiddleware = require('../middleware/password');
const userQuerie = require('../queries/usersQueries');
const jwt = require('jsonwebtoken');

module.exports.registrationUser = async (req, res) => {
    const user = req.body;
    const password = await passwordMiddleware.hashPass(req.body.password);
    const newUser = await userQuerie.createUser({ ...user, password });
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
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        throw new Error('need token');
    }
    const tokenData = jwt.verify(accessToken, 'SECRET_FOR_TOKEN');
    const userId = tokenData.userId;
    const user = await userQuerie.getUser(userId);
    res.send({
        firstName: user.firstName,
        userId: user.id,
        lastName: user.lastName,
        displayName: user.displayName,
        accessToken: user.accessToken,
        email: user.email,
    });
};
