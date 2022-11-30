const { users } = require("./data/database");

/**
 * Returns a string of random alphanumeric characters from a given length.
 * @param  {number} idLength
 * @returns  {string} a 6 character longe alphanumeric string
 */
const generateRandomString = () => {
  const numbers =  "0123456789";
  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const string = numbers + lowerLetters + upperLetters;
  
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomChar = string[Math.floor(Math.random() * string.length)];
    result += randomChar;
  }
  return result;
};

const validateFields = (email, password) => {
  if (!email || !password) return false;
  return true;
};

const lookupUser = (email) => {
  for (const user in users) {
    if (users[user].email === email) return users[user];
  }
  return null;
};

console.log(lookupUser("user2@example.com"));

module.exports = {
  generateRandomString,
  validateFields,
  lookupUser
};