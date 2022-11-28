/**
 * Returns a string of 6 random alphanumeric characters.
 */
const generateRandomString = () => {
  const numbers =  '0123456789';
  const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const string = numbers + lowerLetters + upperLetters;
  
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomChar = string[Math.floor(Math.random() * string.length)];
    result += randomChar;
  }
  return result;
};

module.exports = {
  generateRandomString
};