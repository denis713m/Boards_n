import bcrypt from 'bcryptjs';

export const hashPass = (password) => {
  try {
    const hashPass = bcrypt.hashSync(password, 5);
    return hashPass;
  } catch (e) {
    console.log(e)
    throw new Error('Server Error on hash password');
  }
};

export const passwordCompare = (pass1, pass2) => {
  const passwordCompare = bcrypt.compareSync(pass1, pass2);
  if ( !passwordCompare) {
    throw new Error('WRONG_PASSWORD');
  }
};