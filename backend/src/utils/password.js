// import bcrypt from 'bcryptjs'

// export const hashPassword = async (plain) => bcrypt.hash(plain, 10)
// export const comparePassword = async (plain, hash) => bcrypt.compare(plain, hash)
// import bcrypt from 'bcryptjs';

// const SALT_ROUNDS = 10;

// export const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

// export const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);
// import bcrypt from "bcryptjs";

// const SALT_ROUNDS = 10;

// export const hashPassword = async (plain) => bcrypt.hash(plain, SALT_ROUNDS);
// export const comparePassword = async (plain, hash) => bcrypt.compare(plain, hash);

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
