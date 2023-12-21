const publishService = require('@services/v1/publish');
const productCategoryMappingController = require('@services/v1/ProductCategoryMapping');
const productController = require('@services/v1/Product');
const CatalogService = require('@root/src/apis/services/v1/catalog');
const CategoryService = require('@root/src/apis/services/v1/Category');
const productCategoryService = require('@services/v1/ProductCategoryMapping');
const { Logger: log } = require('sarvm-utility');

const productService = require('@root/src/apis/services/v1/Product');
const { uploadJSONtoS3, getJsonUrl } = require('@root/src/common/libs/JsonToS3/JsonToS3');
const products = async (category_id) => {
  const products = await productCategoryMappingController.products(category_id);
  const productIdList = products.map((item) => {
    return item.product_id;
  });
  const productDetails = await (
    await productController.getProductListsByIds(productIdList)
  ).map((item) => {
    return {
      name: item.name,
      image: item.image,
      id: item.product_id,
    };
  });
  return productDetails;
};

const microCategoris = async (parent_id) => {
  const result = await publishService.subCategory(parent_id);
  const microCategoris = await Promise.all(
    result.map(({ name, category_id, image }) =>
      products(category_id).then((d) => ({
        name,
        id: category_id,
        image,
        products: d,
      })),
    ),
  );
  const allMicroCategoryProducts = [];
  microCategoris.map((category) => {
    const { products } = category;
    products.map((product) => {
      if (!allMicroCategoryProducts.includes(product)) {
        allMicroCategoryProducts.push(product);
      }
    });
  });
  microCategoris.unshift({
    name: 'all',
    products: allMicroCategoryProducts,
  });
  return microCategoris;
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const subCategories = async (parent_id) => {
  const result = await publishService.subCategory(parent_id);
  const subcategories = await Promise.all(
    result.map(({ name, category_id, image }) =>
      microCategoris(category_id).then((d) => ({
        name,
        id: category_id,
        image,
        microCategoris: d,
      })),
    ),
  );
  return subcategories;
};

const publishCatalog = async (version) => {
  log.info({ info: 'Catalog Controller :: Inside publish catalog' });
  try {
    const response = [];
    const result = await CatalogService.catalogList();

    for (let catalog of result) {
      const catalogCategories = [];
      const { catalog_id } = catalog;
      const categories = await CategoryService.categeriesByCatalogID(catalog_id);
      for (let category of categories) {
        const catalogSubCatgories = [];
        const { category_id } = category;
        const subCategories = await CategoryService.categeriesByParentID(category_id);
        const allSubCategoryArray = [];

        for (let subCategory of subCategories) {
          const { category_id } = subCategory;
          const productList = (await productCategoryService.products(category_id)).map((item) => {
            return item.product_id;
          });
          const products = await productService.getProductListsByIds(productList);
          catalogSubCatgories.push({
            ...subCategory,
            id: category_id,
            products,
          });
          allSubCategoryArray.push(...products);
        }
        var unique = allSubCategoryArray.filter(onlyUnique);
        catalogSubCatgories.push({
          name: 'All',
          products: unique,
        });
        catalogCategories.push({
          ...category,
          id: category_id,
          microCategoris: catalogSubCatgories,
        });
      }

      response.push({
        ...catalog,
        id: catalog_id,
        subCategories: catalogCategories,
      });
    }

    const key = `test_data/test_data/matereCatalog_${version}.json`;
    const url = await getJsonUrl(key);

    const uploadToS3 = await uploadJSONtoS3(key, response);

    return url;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};

module.exports = { publishCatalog };
