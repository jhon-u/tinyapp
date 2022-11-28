/*
*
*/
const generateRandomString = () => {
  const numbers =  '0123456789';
  const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const string = numbers + lowerLetters + upperLetters;

  let result = '';

  for (const char of string) {
    if (result.length >= 6) break;
    const randomChar = string[Math.floor(Math.random() * string.length)];
    result += randomChar;
  }

  console.log(result);
  return;
};

generateRandomString();