/**
 * Returns a 6 character long string of random alphanumeric characters.
 * @param  {number} idLength
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

/** Returns either the entire user object or null if not found.
 * @param  {string} email
 * @param  {object} database The database to use to find the user.
 */
const getUserByEmail = (email, database) => {
  for (const user in database) {
    if (database[user].email === email) return database[user];
  }
  return null;
};

/**
 * Returns URLs where userID equals id of logged in user.
 * @param  {string} userID
 * @param  {object} database The database to use to find the user's urls.
 */
const urlsForUser = (userID, database) => {
  const asArray = Object.entries(database);
  // eslint-disable-next-line no-unused-vars
  const filteredURLs = asArray.filter(([key, value]) => value.userID === userID);
  return Object.fromEntries(filteredURLs);
};

/**
 * Returns a boolean if the URL exists in the database or if the URL
 * belongs to the user.
 * @param  {Object} urls
 * @param  {string} userID
 */
const checkIfURLExist = (urls, urlID) => {
  for (const url in urls) {
    if (url === urlID) return true;
  }
  return false;
};


module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
  checkIfURLExist
};