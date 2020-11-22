const jwt = require('jsonwebtoken');
const CONSTANTS  = require('../CONSTANTS');

module.exports.generateTokens = (user) => {
    console.log(CONSTANTS.SECRET_FOR_TOKEN);
    const accessToken = jwt.sign({
        firstName: user.firstName,
        userId: user.id,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
    }, CONSTANTS.SECRET_FOR_TOKEN, { expiresIn: CONSTANTS.ACCESSTOKEN_EXPIRE });
    // const refreshToken = jwt.sign({
    //     email: user.email
    // }, CONSTANTS.REFRESH_JWT_SECRET, { expiresIn: '2h' });
    return { accessToken,
        //refreshToken: refreshToken
    }
};