const { v4: uuidv4 } = require('uuid');

exports.up = async function (knex) {
  const uniqueUserIds = await knex('shop').distinct('user_id').pluck('user_id');

  for (const userId of uniqueUserIds) {
    try {
      await knex('retailer').insert({
        user_id: userId,
        r_id: uuidv4(),
      });
    } catch (err) {
      // If the insert fails because of a duplicate key error, ignore the error and move on
      if (err.code !== '23505') {
        throw err; // Re-throw the error if it's not a duplicate key error
      }
    }
  }
};

exports.down = async function (knex) {
  await knex('retailer').del();
};
