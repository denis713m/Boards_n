import jwt from 'jsonwebtoken';
import CONSTANTS from './CONSTANTS';

export const generateTokens = (user) => {
    const accessToken = jwt.sign({
        firstName: user.firstName,
        userId: user.userId,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
    }, CONSTANTS.SECRET_FOR_TOKEN, { expiresIn: CONSTANTS.ACCESSTOKEN_EXPIRE });

    return accessToken
};