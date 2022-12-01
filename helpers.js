const { users, urlDatabase } = require("./data/database");

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

/**
 * Validates if the email and passwords fields are empty
 * @param  {string} email
 * @param  {string} password
 * @returns  {boolean} returns a boolean if the email and passwords fields are or are not empty, null or undefined
 */
const validateFields = (email, password) => {
  if (!email || !password) return false;
  return true;
};

/** Returns either the entire user object or null if not found.
 * @param  {string} email
 * @returns  {(null|Object)} either the entire user object or null if not found.
 */
const getUserByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) return users[user];
  }
  return null;
};

const urlsForUser = (userID) => {
  const asArray = Object.entries(urlDatabase);
  const filteredURLs = asArray.filter(([key, value]) => value.userID === userID);
  return Object.fromEntries(filteredURLs);
};

const checkIfURLExist = (urls, urlID) => {
  for (const url in urls) {
    if (url === urlID) return true;
  }
  return false;
};


module.exports = {
  generateRandomString,
  validateFields,
  getUserByEmail,
  urlsForUser,
  checkIfURLExist
};