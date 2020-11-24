const bcrypt = require('bcrypt');

module.exports.hashPass = async (req, res, next) => {
  try {
    req.hashPass = await bcrypt.hash(req.body.password, 5);
    next();
  } catch (err) {
    next(new Error('Server Error on hash password'));
  }
};

module.exports.passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if ( !passwordCompare) {
    throw new Error('WRONG_PASSWORD');
  }
};