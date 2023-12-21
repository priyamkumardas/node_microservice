const XLSX = require('xlsx');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const isImageUrl = require('is-image-url');
const { cdnUrl } = require('@config');
const { Logger: log } = require('sarvm-utility');
const { default: ShortUniqueId } = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });
const { INTERNAL_SERVER_ERROR } = require('../../errors');
const cdnPrefix = `https://uat-static.sarvm.ai/catalog_images`;

const sanitizeString = (str) => {
  return str
    .replace(/-+/g, ' ')
    .replace(/_+/g, ' ')
    .replace(/\/+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .join('_')
    .toLowerCase();
};

const createUniqueId = () => {
  const uniqueId = uid();
  return uniqueId;
};

const catalogMap = {};
const categoryMap = {};
const productMap = {};
const categoryMappingArray = [];
const categoryProduct = [];

const addToMap = (map, key, data) => {
  if (!map[key]) {
    const id = createUniqueId();
    map[key] = {
      ...data,
      id,
    };
  }
  return map[key].id;
};

const convertToArray = (obj) => {
  return Object.values(obj);
};

const insertItem = (item) => {
  const { category, subCategory, microCategory, product, productId, ...productData } = item;
  if (!productId) {
    const categoryKey = sanitizeString(category);
    const subCategoryKey = sanitizeString(subCategory);
    const microCategoryKey = sanitizeString(microCategory);
    const productKey = sanitizeString(product);

    const categoryId = addToMap(catalogMap, categoryKey, {
      name: category,
      dummyKey: categoryKey,
      image: `${cdnPrefix}/categories/${categoryKey}.svg`,
    });
    const subCategoryId = addToMap(categoryMap, subCategoryKey, {
      name: subCategory,
      dummyKey: subCategoryKey,
      image: `${cdnPrefix}/categories/${subCategoryKey}.svg`,
    });
    const microCategoryId = addToMap(categoryMap, microCategoryKey, {
      name: microCategory,
      dummyKey: microCategoryKey,
      image: `${cdnPrefix}/categories/${microCategoryKey}.svg`,
    });
    const productId = addToMap(productMap, productKey, {
      name: product,
      dummyKey: productKey,
      image: `${cdnPrefix}/products/${productKey}.png`,
      ...productData,
    });

    const subCatMapData = {
      id: createUniqueId(),
      catalog_id: categoryId,
      category_id: subCategoryId,
      parent_id: null,
    };
    const categoryMappingId = createUniqueId();
    const microCatMapData = {
      id: categoryMappingId,
      catalog_id: categoryId,
      category_id: microCategoryId,
      parent_id: subCategoryId,
    };
    const catProdData = {
      id: createUniqueId(),
      product_id: productId,
      catalog_id: categoryId,
      category_mapping_id: categoryMappingId,
    };
    categoryMappingArray.push(subCatMapData);
    categoryMappingArray.push(microCatMapData);
    categoryProduct.push(catProdData);
  }
};

const loadCategoryData = async (location) => {
  log.info({ info: 'Catalog Controller :: Inside load category data' });
  try {
    var workbook = XLSX.readFile(location);
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const worksheetData = XLSX.utils.sheet_to_json(worksheet);
      worksheetData.forEach((item, i) => {
        let {
          Category: category,
          'Sub-Category': subCategory,
          'Micro-Category': microCategory,
          Product: product,
          'Product ID': productId,
          Description: description,
          'Place Of Origin': place_of_origin,
          'Tax Status': taxStatus,
          'Tax Slab': taxSlabs,
          Attributes: attributes,
          'Sold By': soldBy,
          'Minimum quantity per order': minQty,
          'Maximum quantity per order': maxQty,
          'Regular price': regularPrice,
          'Return option': returnOption,
          Season: season,
          'Grade (future use)': grade,
          Region: region,
          'Minimum price per order': minPrice,
          'Weight Per Piece': weightPerPiece,
          MRP: mrp,
          Popularity: popularity,
          Type: veg,
          HSN: hsn,
          UPC: upc,
          Status: status,
          Reamark: remark,
        } = item;

        const data = {
          category,
          subCategory,
          microCategory,
          product,
          productId,
          description,
          place_of_origin,
          tax_status: taxStatus == 'TAXABLE' ? 'TAXABLE' : 'NON_TAXABLE',
          // taxSlabs,
          // attributes,
          // soldBy,
          min_oq: minQty,
          max_oq: maxQty,
          rp: regularPrice,
          return_option: returnOption,
          // season,
          // grade,
          // region,
          min_ppo: minPrice,
          weight_per_piece: weightPerPiece,
          mrp,
          // popularity,
          veg: veg,
          hsn,
          // upc,
          status: status == 'Published' ? 'ACTIVE' : 'INACTIVE',
          // remark,
        };
        insertItem(data);
      });
    });

    const catalog = convertToArray(catalogMap);
    const category = convertToArray(categoryMap);
    const product = convertToArray(productMap);
    let result = {
      catalog,
      category,
      product,
      categoryMappingArray,
      categoryProduct,
    };
    return result;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

module.exports = { loadCategoryData, sanitizeString };
