const generateRandomString = () => {
  const numbers =  '0123456789';
  const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const string = numbers + lowerLetters + upperLetters;
  console.log(string);
  return;
};

generateRandomString();