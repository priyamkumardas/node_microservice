const APICalls = require('./utils/apiCalls');
const { Logger: log } = require('sarvm-utility');

const categoryList = (retailerCatalog) => {
  log.info({ info: 'Catalog Controller :: Inside category list' });
  const { categories, products } = retailerCatalog;
  return categories;
};
const generateRetailerCatalog = async (args) => {
  log.info({ info: 'Catalog Controller :: Inside generate retailer catalog' });
  try {
    const { retailerCatalogURL, masterCatalogURL } = args;

    const { categoriesURL, productsURL, microCategoriesURL } = masterCatalogURL;

    const retailerCatalog = await APICalls.apiData(retailerCatalogURL);
    const categories = await APICalls.apiData(categoriesURL);
    const MasterProducts = await APICalls.apiData(productsURL);
    const microCategories = await APICalls.apiData(microCategoriesURL);

    const retailerCategoryList = categoryList(retailerCatalog);
    const res = [];
    const { products } = retailerCatalog;
    retailerCategoryList.forEach((retailerCategory) => {
      const item = categories[retailerCategory];
      let { subCategories, name, image } = item;
      const subCat = [];
      subCategories.forEach((subCatItem) => {
        const prod = [];
        products.forEach((retPro) => {
          if (subCatItem.name === retPro.subCategory.name) {
            prod.push(retPro);
          }
        });
        subCat.push({
          name: subCatItem.name,
          image: subCatItem.image,
          products: prod,
        });
      });

      res.push({
        name: item.name,
        subCategories: subCat,
        image: item.image,
      });
    });

    return res;
  } catch (error) {
    log.error({ error: error });
    return 'error while creating retailer catalg';
  }
};

module.exports = { generateRetailerCatalog };
