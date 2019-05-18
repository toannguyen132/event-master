const bcrypt = require('bcrypt');

const ROUNDS = 10;

const hashPassword = password => bcrypt.hashSync(password, ROUNDS);

const verifyPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = { hashPassword, verifyPassword };
