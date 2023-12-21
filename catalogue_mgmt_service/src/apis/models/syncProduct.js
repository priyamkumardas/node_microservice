/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
const { Pool } = require('pg');

const {
  SqlDB: {
    connection: { host, user, database, password, port },
  },
} = require('@config');

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
});

const getCatalogData = async () => {
  if (1) {
    const catalogQuery = `
  SELECT *
  FROM "catalog";
`;

    const categoriesQuery = `
  SELECT *
  FROM "category";
`;

    const categoryMappingsQuery = `
  SELECT *
  FROM "category_mapping";
`;

    const productCategoryMappingsQuery = `
  SELECT *
  FROM "category_product";
`;

    const productsQuery = `
  SELECT *
  FROM "product";
`;

    const [catalogRes, categoriesRes, categoryMappingsRes, productCategoryMappingsRes, productsRes] = await Promise.all(
      [
        pool.query(catalogQuery),
        pool.query(categoriesQuery),
        pool.query(categoryMappingsQuery),
        pool.query(productCategoryMappingsQuery),
        pool.query(productsQuery),
      ],
    );

    const catalogRows = catalogRes.rows;
    const categoriesRows = categoriesRes.rows;
    const categoryMappingsRows = categoryMappingsRes.rows;
    const productCategoryMappingsRows = productCategoryMappingsRes.rows;
    const productsRows = productsRes.rows;

    return {
      catalogRows,
      categoriesRows,
      categoryMappingsRows,
      productCategoryMappingsRows,
      productsRows,
    };
  }
};

const getCatalogMap = async () => {
  //
  // Map Catalogs
  const { catalogRows, categoriesRows, categoryMappingsRows, productCategoryMappingsRows, productsRows } =
    await getCatalogData();

  const catalogMap = new Map();
  const categoryMap = new Map();
  const categoryMappingMap = new Map();
  const productCategoryMappingMap = new Map();
  const productMap = new Map();

  for (const row of catalogRows) {
    catalogMap.set(row.id, {
      id: row.id,
      name: row.name,
      image: row.image,
      categories: [],
    });
  }

  // Map Categories
  for (const row of categoriesRows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      image: row.image,
      categories: [],
      products: [],
    });
  }

  // Map Category Mappings
  for (const row of categoryMappingsRows) {
    categoryMappingMap.set(row.id, {
      id: row.id,
      catalogId: row.catalog_id,
      categoryId: row.category_id,
      parentId: row.parent_id,
      parentMappingId: row.parent_mapping_id,
    });
  }

  // Map Product Category Mappings
  for (const row of productCategoryMappingsRows) {
    productCategoryMappingMap.set(row.id, {
      id: row.id,
      productId: row.product_id,
      categoryMappingId: row.category_mapping_id,
      catalogId: row.catalog_id,
    });
  }

  for (const row of productsRows) {
    productMap.set(row.id, {
      id: row.id,
      name: row.name,
      image: row.image,
    });
  }

  return {
    catalogMap,
    categoryMap,
    categoryMappingMap,
    productCategoryMappingMap,
    productMap,
    productsRows,
  };
};

module.exports = {
  getCatalogMap,
};
