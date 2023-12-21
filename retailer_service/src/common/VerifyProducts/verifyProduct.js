/* eslint-disable no-restricted-syntax */
const checkCatalogWithHoushold = (catalogDataFromDataBase, catalogDataFromHoushold) => {
  const productListFromDataBase = catalogDataFromDataBase.products;
  const productListFromHouseHoldApplication = catalogDataFromHoushold.products;

  for (const productHouseHold of productListFromHouseHoldApplication) {
    let isItemAvailabe = true;
    let dataBaseItem;
    for (const productDatabase of productListFromDataBase) {
      if (productHouseHold.id === productDatabase.id) {
        isItemAvailabe = true;
        dataBaseItem = productDatabase;
      }
    }
    if (isItemAvailabe === false) {
      return false;
    }

    for (const key of Object.keys(productHouseHold)) {
      if (productHouseHold[key] !== dataBaseItem[key]) {
        return false;
      }
    }
  }

  return true;
};

module.exports = { checkCatalogWithHoushold };
