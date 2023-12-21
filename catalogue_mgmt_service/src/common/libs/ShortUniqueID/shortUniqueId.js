const { default: ShortUniqueId } = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });

const uniqeNumber = () => {
  const uniqueId = uid();
  return uniqueId;
};

console.log(uniqeNumber());
module.exports = { uniqeNumber };
