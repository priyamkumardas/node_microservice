const { COL_VALUES, COLUMNS, TABLES } = require('../../../../constants/dbConstants');

exports.seed = async function (knex) {
  const data = await knex
    .select(COLUMNS.SHOP.SHOP_ID, COLUMNS.SHOP.ID)
    .from(TABLES.TB_SHOP)
    .where(COLUMNS.SHOP.ID, COL_VALUES.SHOP.ID);

  for (let i = 0; i < data.length; i += 1) {
    const NEW_ID = Math.random().toString(36).substring(2, 11);
    const currRow = data[i];
    const result = await knex(TABLES.TB_SHOP)
      .update(COLUMNS.SHOP.ID, NEW_ID)
      .where(COLUMNS.SHOP.SHOP_ID, currRow[COLUMNS.SHOP_ID]);
    console.log(`result: ${JSON.stringify(result)}`);
  }
};
