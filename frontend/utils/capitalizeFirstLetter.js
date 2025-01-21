export const capitalizeFirstLetter = (word) => {
  const wordingsInLowerCase = word.toLowerCase().split(" ");
  const capitalizeFirstLetterInArray = wordingsInLowerCase.map((word) => {
    word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizeFirstLetterInArray.join(" ");
};
