const CONSTANTS = require('../../constants/constants');

const makeIdGeneric = (length, base) => {
  const startIndex = CONSTANTS.ID.BASE_START_INDEX;
  const uptoIndex = length + startIndex - 1;
  return Math.random().toString(base).substring(startIndex, uptoIndex);
};

const makeIdBase62 = (length) => {
  let result = '';
  const characters = CONSTANTS.ID.CHARSET_62;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const makeId = (whichBase, length = CONSTANTS.ID.DEF_ID_LEN) => {
  if (whichBase === CONSTANTS.ID.BASE_NUMERIC || CONSTANTS.ID.BASE_36) {
    const base = CONSTANTS.ID.NUM_10 ? CONSTANTS.ID.NUM_10 : CONSTANTS.ID.NUM_36;
    return makeIdGeneric(length, base);
  }
  return makeIdBase62(length);
};

module.exports = { makeIdGeneric, makeIdBase62, makeId };
