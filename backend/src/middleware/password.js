const bcrypt = require('bcrypt');

module.exports.hashPass = async (password) => {
    return await bcrypt.hash(password, 5);
};

module.exports.passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if ( !passwordCompare) {
    throw new Error('WRONG_PASSWORD');
  }
};