/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
const { getCatalogMap } = require('@models/syncProduct');
const { uploadJSONtoS3, getJsonUrl, uniqueS3Key } = require('@root/src/common/libs/JsonToS3/JsonToS3');
const { createUUID } = require('@root/src/common/libs/uuid/uuid4');
const config = require('@config');
const Catalog = require('../../models/catalog');
const Category = require('../../models/category');
const e = require('express');

const convertToArray = (obj) => {
  return Object.values(obj);
};

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

const pushToMap = ({ map, key, value }) => {
  if (!map.get(key)) {
    map.set(key, new Map());
  }
  if (!map.get(key).get(value.id)) {
    map.get(key).set(value.id, value);
  }
};
const sortByPopular = async (catalog) => {
  for (let i = 0; i < catalog.length; i++) {
    let item = catalog[i];
    let categories = item.categories;
    let popularIndex = categories.map((e) => e.name).indexOf('Popular');
    let replaceData = categories[0];
    categories[0] = categories[popularIndex];
    categories[popularIndex] = replaceData;
    catalog[i].categories = categories;
  }
  return catalog;
};

const getTreeForCatalogWithoutProducts = async ({
  categoryMappingMap,
  originalCatalogMap,
  masterCatalog,
  originalCategoryMap,
}) => {
  try {
    let originalCatalogKeys = Array.from(originalCatalogMap.keys());

    let masterCatalogKeys = masterCatalog.map((item) => item.id);
    let keyDiff = originalCatalogKeys.filter((item) => !masterCatalogKeys.includes(item));
    const categoryMappingOfKeyDiff = [];
    const categoryDataOfKeyDiff = {};
    for (let [key, value] of categoryMappingMap) {
      if (keyDiff.includes(value.catalogId)) {
        categoryMappingOfKeyDiff.push(value);
        if (value.catalogId in categoryDataOfKeyDiff) {
          categoryDataOfKeyDiff[value.catalogId].push(originalCategoryMap.get(value.categoryId));
        } else {
          categoryDataOfKeyDiff[value.catalogId] = [originalCategoryMap.get(value.categoryId)];
        }
      }
    }
    let response = [];
    keyDiff.map((item) => {
      let ele = originalCatalogMap.get(item);
      response.push({
        id: ele.id,
        name: ele.name,
        key: sanitizeString(ele.name),
        image: ele.image,
        categories: categoryDataOfKeyDiff[ele.id] || [],
      });
    });
    return response;
  } catch (err) {
    console.log(err, 'ERR_[getTreeForCatalogWithoutProducts]');
  }
};

const constructPCPIndexedMap = (productCategoryMappingMap, productMap, attribute) => {
  const reIndexedMap = new Map();
  productCategoryMappingMap.forEach((mapping) => {
    const { productId } = mapping;
    if (productMap.get(productId)) {
      if (!reIndexedMap.get(mapping[attribute])) {
        reIndexedMap.set(mapping[attribute], []);
      }
      // const product = productMap.get(productId);
      mapping.product = productMap.get(productId);
      reIndexedMap.get(mapping[attribute]).push(mapping);
    }
  });
  return reIndexedMap;
};
const constructProduct = (item, productNameIdMap) => {
  const nameId = sanitizeString(item.name);
  const product = productNameIdMap.get(nameId);
  return product;
};

const getCategoryMapping = (categoryMap, categoryMappingId, categoryMappingMapWithCategory) => {
  if (!categoryMap.get(categoryMappingId)) {
    const { category, parentMappingId, catalogId } = categoryMappingMapWithCategory.get(categoryMappingId);
    const { id, name, image } = category;
    const categoryData = { id, name, image, categories: [], products: [] };
    categoryMap.set(categoryMappingId, {
      category: categoryData,
      parentMappingId,
      catalogId,
    });
  }
  return categoryMap.get(categoryMappingId);
};

const getSubCatalog = (subCatalogMap, catalogId, catalogMap) => {
  if (!subCatalogMap.get(catalogId)) {
    const { id, name, image } = catalogMap.get(catalogId);
    const categoryData = { id, name, image, categories: [], products: [] };
    subCatalogMap.set(catalogId, categoryData);
  }
  return subCatalogMap.get(catalogId);
};

const subTree = (
  parentCategoryMappingId,
  childCategory,
  categoryMappingMapWithCategory,
  categoryMap,
  subCatalogMap,
  catalogMap,
) => {
  const parentCategoryMapping = getCategoryMapping(
    categoryMap,
    parentCategoryMappingId,
    categoryMappingMapWithCategory,
  );

  const { category, parentMappingId, catalogId } = parentCategoryMapping;
  category.categories.push(childCategory);

  if (!parentMappingId) {
    const catalog = getSubCatalog(subCatalogMap, catalogId, catalogMap);
    catalog.categories.push(category);
    return;
  }
  subTree(parentMappingId, category, categoryMap, subCatalogMap);
};

const getCategory = (originalCategoryMap, categoryMap, categoryId, categoryMappingId) => {
  const { id, name, image } = originalCategoryMap.get(categoryId);
  if (!categoryMap.get(categoryMappingId)) {
    categoryMap.set(categoryMappingId, {
      id,
      name,
      image,
      categories: [],
      products: [],
    });
  }
  return categoryMap.get(categoryMappingId);
};
// const getCatalog =

const updateParentCategoryMappingMap = (
  categoryMappingId,
  categoryMappingMap,
  originalCategoryMap,
  parentCategoryMappingMap,
  categoryMap,
  catalogId,
  originalCatalogMap,
  catalogMap,
) => {
  if (!categoryMappingId) {
    const catalog = getCategory(originalCatalogMap, catalogMap, catalogId, catalogId);
    return;
  }
  const categoryMapping = categoryMappingMap.get(categoryMappingId);
  const { parentMappingId, categoryId, id } = categoryMapping;
  const category = getCategory(originalCategoryMap, categoryMap, categoryId, id);
  pushToMap({
    map: parentCategoryMappingMap,
    key: parentMappingId,
    value: { ...categoryMapping, category },
  });
  updateParentCategoryMappingMap(
    parentMappingId,
    categoryMappingMap,
    originalCategoryMap,
    parentCategoryMappingMap,
    categoryMap,
    catalogId,
    originalCatalogMap,
    catalogMap,
  );
  return category;
};

const constructMaps = (
  productCategoryMappingProductIdIndexedMap,
  categoryMappingMap,
  originalCategoryMap,
  originalCatalogMap,
  productMap,
) => {
  // const categoryMap = new Map();
  const parentCategoryMappingMap = new Map();
  const catalogMap = new Map();
  const categoryMap = new Map();

  productMap.forEach((product) => {
    const mappings = productCategoryMappingProductIdIndexedMap.get(product.id);
    if (mappings) {
      mappings.forEach((mapping) => {
        const { catalogId, categoryMappingId } = mapping;

        const category = updateParentCategoryMappingMap(
          categoryMappingId,
          categoryMappingMap,
          originalCategoryMap,
          parentCategoryMappingMap,
          categoryMap,
          catalogId,
          originalCatalogMap,
          catalogMap,
        );
      });
    }
  });
  parentCategoryMappingMap.forEach((mapping, key) => {
    const arr = Array.from(mapping, ([key, value]) => value);
    parentCategoryMappingMap.set(key, arr);
  });
  return {
    catalogMap,
    categoryMap,
    parentCategoryMappingMap,
  };
};

const constructTree = (
  parentCategoryMappingMap,
  originalCatalogMap,
  catalogMap,
  category,
  catalogId,
  parentMappingId,
  categoryMap,
  originalCategoryMap,
  categoryProductMappingMapCMIndexedMap,
) => {
  const categoryMappingParent = parentCategoryMappingMap.get(parentMappingId);
  if (categoryMappingParent) {
    categoryMappingParent.forEach((mapping) => {
      if (catalogId === mapping.catalogId) {
        const childCategory = getCategory(originalCategoryMap, categoryMap, mapping.category.id, mapping.id);
        childCategory.id = mapping.id;
        const products = categoryProductMappingMapCMIndexedMap.get(mapping.id);
        if (products) {
          childCategory.products = products.map((item) => item.product);
        }

        category.categories.push(childCategory);
        constructTree(
          parentCategoryMappingMap,
          originalCatalogMap,
          catalogMap,
          childCategory,
          catalogId,
          mapping.id,
          categoryMap,
          originalCategoryMap,
          categoryProductMappingMapCMIndexedMap,
        );
      }
    });
  }
};

const getReIndexedProductMaps = (productCategoryMappingMap, productMap) => {
  const categoryProductMappingPIM = constructPCPIndexedMap(productCategoryMappingMap, productMap, 'productId');

  const categoryProductMappingCMIM = constructPCPIndexedMap(productCategoryMappingMap, productMap, 'categoryMappingId');
  return { categoryProductMappingPIM, categoryProductMappingCMIM };
};

const constructProductMap = (productMap, productRows) => {
  const productNameIdMap = new Map();
  productMap.forEach((product) => {
    const productNameId = sanitizeString(product.name);
    productNameIdMap.set(productNameId, product);
  });

  const map = new Map();
  productRows.forEach((item) => {
    let { status, soldBy, grading, price, discount, checked } = item;
    if (soldBy === 'Kgs') soldBy = 'Kg';
    const nameId = sanitizeString(item.name);
    const product = productNameIdMap.get(nameId);
    if (product) {
      map.set(product.id, {
        ...product,
        status,
        soldBy,
        grading,
        price,
        discount,
        checked,
      });
    }
  });
  return map;
};

const getProductsByCategoryId = async (id, prodRows) => {
  let result = [];
  if (prodRows) {
    for (let ele of prodRows) {
      const sub_result = await Category.query()
        .distinct('product.id', 'product.name', 'product.image', 'product.thumbnail')
        .join('category_mapping', 'category_mapping.category_id', 'category.id')
        .join('catalog', 'catalog.id', 'category_mapping.catalog_id')
        .join('category_product', 'category_product.catalog_id', 'catalog.id')
        .join('product', 'product.id', 'category_product.product_id')
        .where('category.id', id)
        .where('product.name', 'ilike', `%${ele.name}%`)
        .limit(10);

      result.push(...sub_result);
    }
  } else {
    const sub_result = await Category.query()
      .distinct('product.id', 'product.name', 'product.image', 'product.thumbnail', 'product.publish')
      .join('category_mapping', 'category_mapping.category_id', 'category.id')
      .join('catalog', 'catalog.id', 'category_mapping.catalog_id')
      .join('category_product', 'category_product.catalog_id', 'catalog.id')
      .join('product', 'product.id', 'category_product.product_id')
      .where('category.id', id)
      .limit(10);

    result.push(...sub_result);
  }
  return result;
};

const getCatalogsByProductId = async (id) => {
  const result = await Catalog.query()
    .distinct('catalog.id', 'catalog.name', 'catalog.image')
    .join('category_product', 'category_product.catalog_id', 'catalog.id')
    .join('product', 'product.id', 'category_product.product_id')
    .where('product.id', id);
  return result;
};

const addAllProductFieldInCategory = async(catalogs)=>{
  
  for(let catalog of catalogs) {
    let objectToBeShifted = null
    let categories = catalog.categories
    for(let category of categories) {
      if(category.name === 'Popular') {
        objectToBeShifted = category
        let subCategory = category.categories
        let allFieldObject = {
          name : "all",
          products : [],
          id : "Popular_all",
          categories : []
        }
        let res = await getProductsByCategoryId(category.id)
        res = res.map((ele)=>{
          return {
            "id" : ele.id,
            "name" : ele.name,
            "image" : ele.image,
            "thumbnail" : ele.thumbnail,
            "soldBy" : "",
            "status" : ele.publish ? "Published" : "Unpublished"
          }
        })
        allFieldObject.products = res
        subCategory.unshift(allFieldObject)
      } else {
        let subCategory = category.categories
        let allFieldObject = {
          name : "all",
          products : [],
          id : `${(category.name).toLowerCase().replace(/ /g, "_")}_all`,
          categories : []
        }
        let res = await getProductsByCategoryId(category.id)
        res = res.map((ele)=>{
          return {
            "id" : ele.id,
            "name" : ele.name,
            "image" : ele.image,
            "thumbnail" : ele.thumbnail,
            "soldBy" : "",
            "status" : ele.publish ? "Published" : "Unpublished"
          }
        })
        allFieldObject.products = res
        subCategory.unshift(allFieldObject)
      }
    }
    if(objectToBeShifted)
    categories.unshift(objectToBeShifted)
  }
}

const isUnique = (value, index, self) => {
  return self.findIndex((obj) => obj.id === value.id) === index;
};

const fillSubCategoriesForParentCategory = (catalogs, parentCategoryMap) => {
  for (let catalog of catalogs) {
    let categories = catalog.categories;
    for (let subItem of categories) {
      if (parentCategoryMap[subItem.id]) {
        subItem.categories.push(parentCategoryMap[subItem.id]);
        parentCategoryMap[subItem.id] = null;
      }
    }
  }
};
const sync = async (prodRows) => {
  try {
    let catalogsData;
    let productMap = {};

    if (!prodRows) {
      catalogsData = await Catalog.query().distinct('id', 'name', 'image');
    } else {
      catalogsData = [];
      for (let product of prodRows) {
        productMap[product.id] = product;
        const catalogsByProductId = await getCatalogsByProductId(product.id);
        catalogsData.push(...catalogsData, ...catalogsByProductId);
      }
      // Remove duplicates
      catalogsData = catalogsData.filter(isUnique);
    }

    let categoriesData = await Category.query()
      .distinct(
        'category.id',
        'category.name',
        'category.image',
        'category_mapping.parent_id',
        'category_mapping.catalog_id',
      )
      .innerJoin('category_mapping', 'category.id', 'category_mapping.category_id')
      .whereIn(
        'category_mapping.catalog_id',
        catalogsData.map((catalog) => catalog.id),
      );

    const categoryMap = {};
    const parentCategoryMap = {};
    // Generating catalog structure
    const catalogs = catalogsData.map((catalog) => {
      const catalogObj = {
        id: catalog.id,
        name: catalog.name,
        key : (catalog.name).toLowerCase().replace(/ /g, "_"),
        image: catalog.image,
        categories: [],
      };

      for (let category of categoriesData) {
        if (category.catalog_id === catalog.id) {
          const categoryObj = {
            id: category.id,
            name: category.name,
            image: category.image,
            categories: [],
            products: [],
          };

          categoryMap[category.id] = categoryObj;
          // Handling Categories and sub-categories
          if (category.parent_id) {
            const parentCategory = categoryMap[category.parent_id];
            if (parentCategory && parentCategory.categories) parentCategory.categories.push(categoryObj);
            else {
              parentCategoryMap[category.parent_id] = categoryObj;
            }
          } else {
            catalogObj.categories.push(categoryObj);
          }
        }
      }

      return catalogObj;
    });

    fillSubCategoriesForParentCategory(catalogs, parentCategoryMap);

    for (let i = 0; i < catalogs.length; i++) {
      catalogs[i].categories = catalogs[i].categories.filter(isUnique);
      let cat_array = catalogs[i].categories;
      for (let cat_Item of cat_array) {
        const subArray = cat_Item.categories.filter(isUnique);
        const promises = [];
        if (!prodRows) {
          //Handling the case when there is no sub categories
          if (subArray.length === 0) {
            promises.push(
              getProductsByCategoryId(cat_Item.id).then((res) => {
                res = res.map((ele)=>{
                    return {
                      "id" : ele.id,
                      "name" : ele.name,
                      "image" : ele.image,
                      "thumbnail" : ele.thumbnail,
                      "soldBy" : "",
                      "status" : ele.publish ? "Published" : "Unpublished"
                    }
                  })
                cat_Item.products = res;
              }),
            );
          } else {
            for (let subItem of subArray) {
              promises.push(
                getProductsByCategoryId(subItem.id).then((res) => {
                  res = res.map((ele)=>{
                    return {
                      "id" : ele.id,
                      "name" : ele.name,
                      "image" : ele.image,
                      "thumbnail" : ele.thumbnail,
                      "soldBy" : "",
                      "status" : ele.publish ? "Published" : "Unpublished"
                    }
                  })
                  subItem.products = res;
                }),
              );
            }
          }
          await Promise.all(promises);
        } else {
          for (let subItem of subArray) {
            let productsByCategory = await getProductsByCategoryId(subItem.id, prodRows);
            productsByCategory.forEach((prod) => {
              if (prodRows.some((obj) => obj.id === prod.id)) {
                subItem.products.push(productMap[prod.id]);
              }
            });
          }
        }
      }
    }
    await addAllProductFieldInCategory(catalogs)

    const uniqueId = `${createUUID()}.json`;
    const key = uniqueS3Key(config.catalogFolder, uniqueId);
    const url = await getJsonUrl(key);

    await uploadJSONtoS3(key, {
      catalog: catalogs,
    });

    return url;
  } catch (err) {
    console.log(err, '[ERR - sync]');
  }
};

module.exports = {
  sync,
};
