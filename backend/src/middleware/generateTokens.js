const jwt = require('jsonwebtoken');
const CONSTANTS  = require('../CONSTANTS');

module.exports.generateTokens = (user) => {
    const accessToken = jwt.sign({
        firstName: user.firstName,
        userId: user.id,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
    }, CONSTANTS.SECRET_FOR_TOKEN, { expiresIn: CONSTANTS.ACCESSTOKEN_EXPIRE });

    return { accessToken }
};