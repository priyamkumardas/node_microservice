const COL_VALUES = {
  SHOP: {
    ID: '1234567890',
  },
};

const COLUMNS = {
  SHOP: {
    ID: 'id',
    SHOP_ID: 'shop_id',
    MANAGER_ID: 'manager_id',
  },
  SHOP_META: {
    CATEGORIES: 'categories',
  },
};
const TABLES = {
  TB_SHOP: 'shop',
  TB_WORKING_HOURS: 'workinghours',
  TB_SHOP_LOCATION: 'shop_location',
  TB_STORE_META_DATA: 'store_meta_data',
  TB_RETAILER: 'retailer',
  TB_PAYMENT_INFO: 'payment_info',
};

module.exports = { COL_VALUES, COLUMNS, TABLES };
