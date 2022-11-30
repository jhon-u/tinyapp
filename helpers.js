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

module.exports = {
  generateRandomString
};