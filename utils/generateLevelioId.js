const generateLevelioId = () => {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `LV${randomNumber}`;
};

module.exports = { generateLevelioId };
