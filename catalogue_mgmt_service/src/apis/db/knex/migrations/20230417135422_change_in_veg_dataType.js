/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('product', (table) => {
      table.string('veg').alter();
    })
    .then(function () {
      // Update the values in the veg column using a CASE statement
      return knex.raw(`
          UPDATE product
          SET veg = 
            CASE 
              WHEN veg = 'true' THEN 'Veg'
              WHEN veg = 'false' THEN 'Non-Veg'
            END
        `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('product', (table) => {
      table.boolean('veg').alter();
    })
    .then(function () {
      // Update the values in the veg column back to boolean using a CASE statement
      return knex.raw(`
          UPDATE product
          SET veg = 
            CASE 
              WHEN veg = 'Veg' THEN true
              WHEN veg = 'Non-Veg' THEN false
            END
        `);
    });
};
