const { Parser } = require('json2csv');
const fs = require('fs');
const moment = require('moment');
const fsPromise = require('fs/promises');
const path = require('path');
const { sendEmailWithAttachments } = require('@common/libs/Email/sesSendEmail');
const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');
const { Model } = require('objection');
const { isDate } = require('@common/utility/dateUtil');
// const CARE = "care@sarvm.ai";
// const WELCOME = "welcome@sarvm.ai";
const { email } = require('@config');
const Shop = require('@models/Shop');
const ShopMetaData = require(`@models/ShopMetaData`);
const axios = require('axios');

const { Logger } = require('sarvm-utility');
const { Logger:log } = require('sarvm-utility');

const {  count } = require('console');

const getEmployeeDetails = async (employeePhones) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db
      .collection('employees')
      .find({ mobileNumber: { $in: employeePhones } })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};

const getEmployeeDetailsByManagerId = async (managerIds) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db
      .collection('employees')
      .find({ managerId: { $in: managerIds } })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getUsers = async (userIds) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db
      .collection('users')
      .find({
        _id: {
          $in: userIds.map((userId) => new mongoose.Types.ObjectId(userId)),
        },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const userids = async (userIds) => {
  try {
    const objectIdParam = new mongoose.Types.ObjectId(userIds);
    const db = mongoose.connection.useDb('ums');
    return await db.collection('users').findOne({ _id: objectIdParam });
  } catch (err) {
    console.log(err);
  }
};

const getReferrals = async (phones, type) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return await db
      .collection('referrals')
      .find({ phone_number: { $in: phones }, type: type })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getEmployeeReferrals = async () => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return await db
      .collection('referrals')

      .find({ refByUserType: new RegExp('^EMPLOYEE') });
  } catch (err) {
    console.log(err);
  }
};
const getEmployeeByMobileNumbers = async (mobileNumbers) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db.collection('employees').find({ mobileNumber: mobileNumbers }).toArray();
  } catch (err) {
    console.log(err);
  }
};
const getlatandlog = async (ref_by_user_id) => {
  try {
    const objectIdParam = new mongoose.Types.ObjectId(ref_by_user_id);
    const db = mongoose.connection.useDb('ums');
    return await db.collection('addresses').findOne({ userId: objectIdParam });
  } catch (err) {
    console.log(err);
  }
};

const getEmployeeByManagerIds = async (managersIds) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db
      .collection('employees')
      .find({ managerId: { $in: managersIds } })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getManagerId = async (employeeId) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db.collection('employees').find({ employeeId: employeeId }).toArray();
  } catch (err) {
    console.log(err);
  }
};
const getRefPhone = async (abc, from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return await db
      .collection('referrals')
      .find({
        refByPhone: abc,
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getrefphone = async (phones) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    const result = await db.collection('referrals').find({ phone_number: phones }).toArray();
    if (
      result === undefined ||
      result.length === 0 ||
      result[0].campaign === undefined ||
      result[0].campaign.signup === undefined
    ) {
      return 'N/A';
    } else {
      return result[0].campaign.signup.status;
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserId = async (phones) => {
  try {
    const db = mongoose.connection.useDb('ums');
    const data = await db.collection('users').find({ phone: phones }).toArray();
    if (data === undefined || data.length === 0) {
      return 'N/A';
    } else {
      return data[0]._id.toString();
    }
  } catch (err) {
    console.log(err);
  }
};
const getShopDetails = async (shopid1) => {
  const result = await Shop.shopListsByUserId(shopid1);
  return result;
};
// const getCatagories = async (shopIds) => {
//   const baseURL = 'https://api.sarvm.ai';

//   const token =
//     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzY5ZDdkNWU5NWEyZjcyYmU2ZTc3ODEiLCJwaG9uZSI6Ijk5ODAwNzY2NTUiLCJ1c2VyVHlwZSI6IlJFVEFJTEVSIiwic2hvcElkIjoyMjgsInNob3BNZXRhIjp7InNob3AiOnsic2hvcF9pZCI6MjI4LCJ1c2VyX2lkIjoiNjM2OWQ3ZDVlOTVhMmY3MmJlNmU3NzgxIiwic2hvcF9uYW1lIjoiUmFqZXNoIE5ldyBSZXRhaWxlciBTaG9wIDU1IiwibG9uZ2l0dWRlIjo3NS43ODcyNzA5LCJsYXRpdHVkZSI6MjYuOTEyNDMzNiwic2hvcF9udW1iZXIiOjU1LCJsb2NhbGl0eSI6IlhZWiBidWlsZGluZyIsImxhbmRtYXJrIjoiWFlaIExhbmRtYXJrIiwiY2l0eSI6IkphaXB1ciIsInN0cmVldCI6IlhZWiBTdHJlZXQiLCJ2ZWciOm51bGwsImRlbGl2ZXJ5IjpudWxsLCJpbWFnZSI6bnVsbCwidHlwZV9vZl9yZXRhaWxlciI6bnVsbCwiR1NUX25vIjpudWxsLCJpc1N1YnNjcmliZWQiOm51bGwsImlzS1lDVmVyaWZpZWQiOm51bGwsInNlbGxpbmdfdHlwZSI6ImZpeGVkIiwicGluY29kZSI6MzAyMDAxLCJjcmVhdGVkX2F0IjoiMjAyMi0xMS0wOFQwNDoxNjoxNi4yNjJaIiwidXBkYXRlZF9hdCI6IjIwMjItMTEtMDhUMDQ6MTY6MTYuMjYyWiJ9LCJmbGFnIjp7InNob3BJZCI6MjI4LCJvbkJvYXJkaW5nIjpmYWxzZSwiaXNTdWJzY3JpYmVkIjpmYWxzZSwiR1NUX25vIjpmYWxzZSwiaXNLWUNWZXJpZmllZCI6ZmFsc2V9fSwic2VnbWVudElkIjoicmV0YWlsZXIiLCJmbHl5VXNlcklkIjoicmV0YWlsZXItYTI4MzVlNjEtMGRjMy00ZGIwLTllOTAtZTc2OWQ0ODJjN2VjIiwic2NvcGUiOlsiVXNlcnMiLCJyZXRhaWxlckFwcCJdLCJpYXQiOjE2Njc5NzQ4MDUsIm5iZiI6MTY2Nzk3NDgwNSwiZXhwIjoxNjk5NTEwODA1LCJpc3MiOiJzYXJ2bTp1bXMiLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.LLniYlNzFz3Kpichi_gdu43aocVBW25F0QGVxF_SD8A';

//   const readRetailerCatalogs = async (retailer_catalog, shopId) => {
//     const catalogData = retailer_catalog.find((item) => item.shop_id === shopId);
//     if (!catalogData) {
//       console.log(`No catalog data found for ${shopId}`);
//       return [];
//     }
//     const { url } = catalogData;
//     try {
//       const response = await axios.get(url);
//       const catalog = response.data.catalog;
//       // const keysArray = catalog.map((item) => item.key);
//       // console.log(`Catalog data for ${shopId}: ${keysArray}`);
//       // return keysArray;
//       return catalog;
//     } catch (error) {
//       console.error('Error retrieving catalog data:', error);
//       return [];
//     }
//   };

//   const getCatalogsForShopIds = async (retailer_catalog, shopIds) => {
//     const catalogs = [];

//     for (const shopId of shopIds) {
//       const catalog = await readRetailerCatalogs(retailer_catalog, shopId);
//       catalogs.push(catalog);
//     }

//     return catalogs;
//   };

//   const getRetailerCatalogByShopId = async () => {
//     try {
//       const config = {
//         method: 'get',
//         url: `${baseURL}/rms/apis/v1/catalog`,
//         headers: {
//           app_name: 'retailerApp',
//           app_version_code: '101',
//           Authorization: token,
//         },
//       };
//       let result = await axios(config);
//       result = result.data;
//       return result.data;
//     } catch (error) {
//       return error;
//     }
//   };

//   let data = [];
//   const updateRetailerDataCache = async (shopIds) => {
//     try {
//       const retailer_catalog = await getRetailerCatalogByShopId();
//       const retailersCatalogData = await getCatalogsForShopIds(retailer_catalog, shopIds);
//       data.push(...retailersCatalogData);
//     } catch (error) {
//       console.error('Error updating retailer data cache:', error);
//     }
//   };

//   await updateRetailerDataCache(shopIds);

//   return data;
// };

// const getCatagories = async (shopIds) => {
//   const baseURL = 'https://api.sarvm.ai';

//   const token =
//     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzY5ZDdkNWU5NWEyZjcyYmU2ZTc3ODEiLCJwaG9uZSI6Ijk5ODAwNzY2NTUiLCJ1c2VyVHlwZSI6IlJFVEFJTEVSIiwic2hvcElkIjoyMjgsInNob3BNZXRhIjp7InNob3AiOnsic2hvcF9pZCI6MjI4LCJ1c2VyX2lkIjoiNjM2OWQ3ZDVlOTVhMmY3MmJlNmU3NzgxIiwic2hvcF9uYW1lIjoiUmFqZXNoIE5ldyBSZXRhaWxlciBTaG9wIDU1IiwibG9uZ2l0dWRlIjo3NS43ODcyNzA5LCJsYXRpdHVkZSI6MjYuOTEyNDMzNiwic2hvcF9udW1iZXIiOjU1LCJsb2NhbGl0eSI6IlhZWiBidWlsZGluZyIsImxhbmRtYXJrIjoiWFlaIExhbmRtYXJrIiwiY2l0eSI6IkphaXB1ciIsInN0cmVldCI6IlhZWiBTdHJlZXQiLCJ2ZWciOm51bGwsImRlbGl2ZXJ5IjpudWxsLCJpbWFnZSI6bnVsbCwidHlwZV9vZl9yZXRhaWxlciI6bnVsbCwiR1NUX25vIjpudWxsLCJpc1N1YnNjcmliZWQiOm51bGwsImlzS1lDVmVyaWZpZWQiOm51bGwsInNlbGxpbmdfdHlwZSI6ImZpeGVkIiwicGluY29kZSI6MzAyMDAxLCJjcmVhdGVkX2F0IjoiMjAyMi0xMS0wOFQwNDoxNjoxNi4yNjJaIiwidXBkYXRlZF9hdCI6IjIwMjItMTEtMDhUMDQ6MTY6MTYuMjYyWiJ9LCJmbGFnIjp7InNob3BJZCI6MjI4LCJvbkJvYXJkaW5nIjpmYWxzZSwiaXNTdWJzY3JpYmVkIjpmYWxzZSwiR1NUX25vIjpmYWxzZSwiaXNLWUNWZXJpZmllZCI6ZmFsc2V9fSwic2VnbWVudElkIjoicmV0YWlsZXIiLCJmbHl5VXNlcklkIjoicmV0YWlsZXItYTI4MzVlNjEtMGRjMy00ZGIwLTllOTAtZTc2OWQ0ODJjN2VjIiwic2NvcGUiOlsiVXNlcnMiLCJyZXRhaWxlckFwcCJdLCJpYXQiOjE2Njc5NzQ4MDUsIm5iZiI6MTY2Nzk3NDgwNSwiZXhwIjoxNjk5NTEwODA1LCJpc3MiOiJzYXJ2bTp1bXMiLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.LLniYlNzFz3Kpichi_gdu43aocVBW25F0QGVxF_SD8A';
//   const readRetailerCatalogs = async (retailer_catalog, shopId) => {
//     const catalogData = retailer_catalog.find((item) => item.shop_id === shopId);
//     if (!catalogData) {
//       console.log(`No catalog data found for ${shopId}`);
//       return [shopId];
//     }
//     const { url } = catalogData;
//     try {
//       const response = await axios.get(url);
//       const catalog = response.data;
//       return catalog;
//     } catch (error) {
//       console.error(`Error retrieving catalog data for shopId ${shopId}:`, error);
//       return [];
//     }
//   };

//   const getCatalogsForShopIds = async (retailer_catalog, shopIds) => {
//     const catalogs = [];

//     for (const shopId of shopIds) {
//       const catalog = await readRetailerCatalogs(retailer_catalog, shopId);
//       catalogs.push(catalog);
//     }

//     return catalogs;
//   };

//   const getRetailerCatalogByShopId = async () => {
//     try {
//       const config = {
//         method: 'get',
//         url: `${baseURL}/rms/apis/v1/catalog`,
//         headers: {
//           app_name: 'retailerApp',
//           app_version_code: '101',
//           Authorization: token,
//         },
//       };
//       const response = await axios(config);
//       const result = response.data;
//       return result.data;
//     } catch (error) {
//       console.error('Error retrieving retailer catalog:', error);
//       throw error; // Rethrow the error to propagate it to the caller
//     }
//   };

//   const updateRetailerDataCache = async (shopIds) => {
//     try {
//       const retailer_catalog = await getRetailerCatalogByShopId();
//       const retailersCatalogData = await getCatalogsForShopIds(retailer_catalog, shopIds);
//       return retailersCatalogData;
//     } catch (error) {
//       console.error('Error updating retailer data cache:', error);
//       throw error; // Rethrow the error to propagate it to the caller
//     }
//   };

//   try {
//     const data = await updateRetailerDataCache(shopIds);
//     return data;
//   } catch (error) {
//     console.error('Error getting categories:', error);
//     return [];
//   }
// };

const baseURL = 'https://api.sarvm.ai';

const token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzY5ZDdkNWU5NWEyZjcyYmU2ZTc3ODEiLCJwaG9uZSI6Ijk5ODAwNzY2NTUiLCJ1c2VyVHlwZSI6IlJFVEFJTEVSIiwic2hvcElkIjoyMjgsInNob3BNZXRhIjp7InNob3AiOnsic2hvcF9pZCI6MjI4LCJ1c2VyX2lkIjoiNjM2OWQ3ZDVlOTVhMmY3MmJlNmU3NzgxIiwic2hvcF9uYW1lIjoiUmFqZXNoIE5ldyBSZXRhaWxlciBTaG9wIDU1IiwibG9uZ2l0dWRlIjo3NS43ODcyNzA5LCJsYXRpdHVkZSI6MjYuOTEyNDMzNiwic2hvcF9udW1iZXIiOjU1LCJsb2NhbGl0eSI6IlhZWiBidWlsZGluZyIsImxhbmRtYXJrIjoiWFlaIExhbmRtYXJrIiwiY2l0eSI6IkphaXB1ciIsInN0cmVldCI6IlhZWiBTdHJlZXQiLCJ2ZWciOm51bGwsImRlbGl2ZXJ5IjpudWxsLCJpbWFnZSI6bnVsbCwidHlwZV9vZl9yZXRhaWxlciI6bnVsbCwiR1NUX25vIjpudWxsLCJpc1N1YnNjcmliZWQiOm51bGwsImlzS1lDVmVyaWZpZWQiOm51bGwsInNlbGxpbmdfdHlwZSI6ImZpeGVkIiwicGluY29kZSI6MzAyMDAxLCJjcmVhdGVkX2F0IjoiMjAyMi0xMS0wOFQwNDoxNjoxNi4yNjJaIiwidXBkYXRlZF9hdCI6IjIwMjItMTEtMDhUMDQ6MTY6MTYuMjYyWiJ9LCJmbGFnIjp7InNob3BJZCI6MjI4LCJvbkJvYXJkaW5nIjpmYWxzZSwiaXNTdWJzY3JpYmVkIjpmYWxzZSwiR1NUX25vIjpmYWxzZSwiaXNLWUNWZXJpZmllZCI6ZmFsc2V9fSwic2VnbWVudElkIjoicmV0YWlsZXIiLCJmbHl5VXNlcklkIjoicmV0YWlsZXItYTI4MzVlNjEtMGRjMy00ZGIwLTllOTAtZTc2OWQ0ODJjN2VjIiwic2NvcGUiOlsiVXNlcnMiLCJyZXRhaWxlckFwcCJdLCJpYXQiOjE2Njc5NzQ4MDUsIm5iZiI6MTY2Nzk3NDgwNSwiZXhwIjoxNjk5NTEwODA1LCJpc3MiOiJzYXJ2bTp1bXMiLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.LLniYlNzFz3Kpichi_gdu43aocVBW25F0QGVxF_SD8A';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readRetailerCatalogs = async (retailer_catalog) => {
  const MAX_CONCURRENT_REQUESTS = 280;
  let catalogData = [];

  for (let i = 0; i < retailer_catalog.length; i++) {
    const { shop_id, url } = retailer_catalog[i];
    const request = axios.get(url);

    catalogData.push({ shop_id, data: request });

    if (i % MAX_CONCURRENT_REQUESTS === 0) {
      await Promise.all(catalogData.slice(i - MAX_CONCURRENT_REQUESTS, i).map((item) => item.data));
      await delay(1000);
    }
  }

  const newData = await Promise.all(catalogData.map((item) => item.data));

  for (let i = 0; i < newData.length; i++) {
    catalogData[i].catalog = newData[i].data;
    delete catalogData[i].data;
  }

  return catalogData;
};

// const readRetailerCatalogs = async (retailer_catalog) => {
//   //   return retailersCatalogDataCache;
//   let catalogData = [];
//   for (const items of retailer_catalog) {
//     const { shop_id, url } = items;
//     const data = axios.get(url);
//     catalogData.push({ shop_id, data });
//   }
//   const x = catalogData.map((item) => item.data);
//   let newData = await Promise.all(x);
//   newData = newData.map((item) => item.data);

//   for (let i = 0; i < newData.length; i++) {
//     catalogData[i].catalog = newData[i];
//     delete catalogData[i].data;
//   }

//   return catalogData;
// };

const getRetailerCatalogByShopId = async () => {
  try {
    const config = {
      method: 'get',
      url: `${baseURL}/rms/apis/v1/catalog`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        Authorization: token,
      },
    };
    let result = await axios(config);
    result = result.data;
    return result.data;
  } catch (error) {
    return error;
  }
};

const getCatalog = async () => {
  let retailer_catalog = await getRetailerCatalogByShopId();
  let retailersCatalogData = await readRetailerCatalogs(retailer_catalog);

  return retailersCatalogData;
};

const getshopdeatils = async () => {
  const result = await Shop.getshopids();
  // const result = await ShopMetaData.getshopids()

  return result;
};

// #Remove it
// const getshopcategory = async (shopid) => {
//   const result = await ShopMetaData.getshopid(shopid);
//   return result;
// };

const getEmployeeReferralsByUserIds = async (from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return db
      .collection('referrals')
      .find({
        //  refByUserType: new RegExp("^EMPLOYEE"),
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getReferral = async (from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return db
      .collection('referrals')
      .find({
        //  refByUserType: new RegExp("^EMPLOYEE"),
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};

const getReferralsByUserIds1 = async (from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return db
      .collection('referrals')
      .find({
        refByUserType: new RegExp('^RETAILER'),
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getReferralsByUserIds = async (from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return db
      .collection('referrals')
      .find({
        refByUserType: new RegExp('^INDIVIDUAL'),
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getEmployeeByUserId = async (userIds) => {
  try {
    const db = mongoose.connection.useDb('ums');
    return await db
      .collection('employees')
      .find({ userId: { $in: userIds } })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getEmployees = async () => {
  try {
    const db = mongoose.connection.useDb('ums');
    let query = {};
    // query = {
    //   $expr: {
    //     $and: [
    //       {
    //         $gte: [
    //           { $dateFromString: { dateString: "$dateofJoining" } },
    //           new Date("2021-01-01 00:00:00"),
    //         ],
    //       },
    //       {
    //         $lte: [
    //           { $dateFromString: { dateString: "$dateofJoining" } },
    //           new Date("2021-03-01 00:00:00"),
    //         ],
    //       },
    //     ],
    //   },
    // };
    return await db.collection('employees').find(query).toArray();
  } catch (err) {
    console.log(err);
  }
};
const getStoreCatalog = async (shopIds) => {
  try {
    const db = mongoose.connection.useDb('rms');
    return await db
      .collection('catalog')
      .find({
        $or: [{ shop_id: { $in: shopIds.map(String) } }, { shop_id: { $in: shopIds.map(Number) } }],
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getSubscriptionData = async (shopIds) => {
  try {
    const db = mongoose.connection.useDb('sub');
    return await db
      .collection('subscription')
      .find({
        shopId: { $in: shopIds.map(String) },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const getSubscriptionsByUserIds = async (userIds) => {
  try {
    const db = mongoose.connection.useDb('sub');
    return await db
      .collection('subscription')
      .find({
        userId: { $in: userIds },
      })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};
const generateReportCatalog = async (startDate, endDate) => {
  log.info({info: 'Report Service :: Inside generate Report Catalog'})
  try {
    let shopData = await getStores(startDate, endDate);
    const userIds = shopData.map((shop) => shop.user_id);
    const shopIds = shopData.map((shop) => shop.shop_id);
    const catalogs = await getStoreCatalog(shopIds);

    const subscriptionData = await getSubscriptionData(shopIds);
    const storeData = shopData.map((shop) => ({
      catalogData: catalogs.find((catalog) => catalog.shop_id == shop.shop_id && catalog),
      subscriptionData: subscriptionData.find(
        (subscription) => subscription.shopId === shop.shop_id.toString() && subscription
      ),
      ...shop,
    }));
    const users = await getUsers(userIds);
    const userPhones = users.map((user) => user.phone);
    const referrals = await getReferrals(userPhones, 'RETAILER');
    const employeePhones = referrals.map((ref) => ref.refByPhone);
    const employeeData = await getEmployeeDetails(employeePhones);
    const returnData = users.map((user) => ({
      shopData: storeData.find((shop) => shop.user_id === user._id.toString() && shop),
      referralData: referrals.find((referral) => referral.phone_number === user.phone && referral),
      ...user,
    }));
    const reportData = returnData.map((user) => ({
      "Retailer's Contact Number": user && user.phone ? user.phone : '',
      "Retailer's Name": user?.basicInformation?.personalDetails
        ? `${user?.basicInformation?.personalDetails?.firstName} ${user?.basicInformation?.personalDetails?.lastName}`
        : '',
      "Retailer's pin code": user && user.shopData ? user.shopData.pincode : '',
      City: user && user.shopData ? user.shopData.city : '',
      'Referred by Phone':
        user && user.referralData && user.referralData.refByPhone
          ? user.referralData.refByPhone
          : '',
      'Referred by Employee/Not':
        user.referralData &&
        user.referralData.refByUserType &&
        user.referralData.refByUserType.startsWith('EMPLOYEE')
          ? true
          : false,
      'Employee Manager phone':
        user && user.referralData && user.referralData.refByPhone
          ? employeeData.find((emp) => emp.mobileNumber === user.referralData.refByPhone && emp)
              ?.mobileNumber
          : '',
      'State Head Name': '',
      'Shop Catalog':
        user &&
        user.shopData &&
        user.shopData.catalogData &&
        user.shopData.catalogData.categories.length
          ? user.shopData.catalogData.categories.join()
          : '',
      'Count of items in catalog':
        user &&
        user.shopData &&
        user.shopData.catalogData &&
        user.shopData.catalogData.products &&
        user.shopData.catalogData.products.length
          ? user.shopData.catalogData.products.length
          : 0,
      'Amount paid':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.amount
          ? user.shopData?.subscriptionData?.amount
          : '',
      'Date of purchase':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.startDate
          ? moment(user.shopData?.subscriptionData?.startDate).format('YYYY-MM-DD')
          : '',
    }));

    const fields = [
      "Retailer's Contact Number",
      "Retailer's Name",
      "Retailer's pin code",
      'City',
      'Referred by Phone',
      'Referred by Employee/Not',
      'Employee Manager phone',
      'State Head Name',
      'Shop Catalog',
      'Count of items in catalog',
      'Amount paid',
      'Date of purchase',
    ];
    const data = await convertToCsv(reportData, fields, 'CatalogPending');
    //return { reportData, ...data };
    sendEmailWithAttachments({
      to: email.report.split(','),
      subject: 'CatalogPending Report',
      body: 'Please Find the attached report',
      attachments: [
        {
          // data: fs.readFileSync(`src/reports/${data.fileName}`, {
          //   encoding: "base64",
          // }),
          data: data.buffer,
          name: data.fileName,
        },
      ],
    });
    return { reportData, ...data };
  } catch (error) {
    console.log(error);
  }
};
const generateReportSubscription = async (startDate, endDate) => {
  log.info({info: 'Report Service :: Inside generate Report Subscription'})

  try {
    let shopData = await getStores(startDate, endDate);
    const userIds = shopData.map((shop) => shop.user_id);
    const shopIds = shopData.map((shop) => shop.shop_id);
    const catalogs = await getStoreCatalog(shopIds);

    const subscriptionData = await getSubscriptionData(shopIds);
    const storeData = shopData.map((shop) => ({
      catalogData: catalogs.find((catalog) => catalog.shop_id == shop.shop_id && catalog),
      subscriptionData: subscriptionData.find(
        (subscription) => subscription.shopId === shop.shop_id.toString() && subscription
      ),
      ...shop,
    }));
    const users = await getUsers(userIds);
    const userPhones = users.map((user) => user.phone);
    const referrals = await getReferrals(userPhones, 'RETAILER');
    const employeePhones = referrals.map((ref) => ref.refByPhone);
    const employeeData = await getEmployeeDetails(employeePhones);
    const managerIds = employeeData.map((emp) => emp.managerId);
    const employeeManagersData = await getEmployeeDetailsByManagerId(managerIds);
    // return employeeManagersData;
    const returnData = users.map((user) => ({
      shopData: storeData.find((shop) => shop.user_id === user._id.toString() && shop),
      referralData: referrals.find((referral) => referral.phone_number === user.phone && referral),
      ...user,
    }));
    const reportData = returnData.map((user) => ({
      "Retailer's Contact Number": user && user.phone ? user.phone : '',
      "Retailer's Name": user?.basicInformation?.personalDetails
        ? `${user?.basicInformation?.personalDetails?.firstName} ${user?.basicInformation?.personalDetails?.lastName}`
        : '',
      "Retailer's pin code": user && user.shopData ? user.shopData.pincode : '',
      City: user && user.shopData ? user.shopData.city : '',
      'Referred by Phone':
        user && user.referralData && user.referralData.refByPhone
          ? user.referralData.refByPhone
          : '',
      'Referred by Employee/Not':
        user.referralData &&
        user.referralData.refByUserType &&
        user.referralData.refByUserType.startsWith('EMPLOYEE')
          ? true
          : false,
      'Employee Manager phone':
        user && user.referralData && user.referralData.refByPhone
          ? employeeData.find((emp) => emp.mobileNumber === user.referralData.refByPhone && emp)
              ?.mobileNumber
          : '',
      'Employee Managers Manager phone':
        user && user.referralData && user.referralData.refByPhone
          ? employeeManagersData.find(
              (empManager) =>
                empManager.managerId ===
                  employeeData.find(
                    (emp) => emp.mobileNumber === user.referralData.refByPhone && emp
                  )?.managerId && empManager
            )?.mobileNumber
          : '',
      'State Head Name': '',
      'Shop Catalog':
        user &&
        user.shopData &&
        user.shopData.catalogData &&
        user.shopData.catalogData.categories.length
          ? user.shopData.catalogData.categories.join()
          : '',
      'Count of items in catalog':
        user &&
        user.shopData &&
        user.shopData.catalogData &&
        user.shopData.catalogData.products &&
        user.shopData.catalogData.products.length
          ? user.shopData.catalogData.products.length
          : 0,
      'Amount paid':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.amount
          ? user.shopData?.subscriptionData?.amount
          : '',
      'Date of purchase':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.startDate
          ? moment(user.shopData?.subscriptionData?.startDate).format('YYYY-MM-DD')
          : '',
    }));
    const fields = [
      "Retailer's Contact Number",
      "Retailer's Name",
      "Retailer's pin code",
      'City',
      'Referred by Phone',
      'Referred by Employee/Not',
      'Employee Manager phone',
      'Employee Managers Manager phone',
      'State Head Name',
      'Shop Catalog',
      'Count of items in catalog',
      'Amount paid',
      'Date of purchase',
    ];

    const data = await convertToCsv(reportData, fields, 'Subscription');

    sendEmailWithAttachments({
      to: [email.report],
      subject: 'Subscription',
      body: 'Please Find the attached report',
      attachments: [
        {
          data: data.buffer,
          name: data.fileName,
        },
      ],
    });
    return { reportData, ...data };
  } catch (error) {
    console.log(error);
  }
};
const generateReportTxn = async (startDate, endDate) => {
  log.info({info: 'Report Service :: Inside generate Report Txn'})
  try {
    let shopData = await getStores(startDate, endDate);
    const userIds = shopData.map((shop) => shop.user_id);
    const shopIds = shopData.map((shop) => shop.shop_id);
    //const catalogs = await getStoreCatalog(shopIds);

    const subscriptionData = await getSubscriptionData(shopIds);
    const storeData = shopData.map((shop) => ({
      // catalogData: catalogs.find(
      //   (catalog) => catalog.shop_id == shop.shop_id && catalog
      // ),
      subscriptionData: subscriptionData.find(
        (subscription) => subscription.shopId === shop.shop_id.toString() && subscription
      ),
      ...shop,
    }));
    const users = await getUsers(userIds);
    const userPhones = users.map((user) => user.phone);
    const referrals = await getReferrals(userPhones, 'RETAILER');
    const employeePhones = referrals.map((ref) => ref.refByPhone);
    const employeeData = await getEmployeeDetails(employeePhones);
    const managerIds = employeeData.map((emp) => emp.managerId);
    const employeeManagersData = await getEmployeeDetailsByManagerId(managerIds);
    // return employeeManagersData;
    const returnData = users.map((user) => ({
      shopData: storeData.find((shop) => shop.user_id === user._id.toString() && shop),
      referralData: referrals.find((referral) => referral.phone_number === user.phone && referral),
      ...user,
    }));
    const reportData = returnData.map((user) => ({
      "Retailer's Contact Number": user && user.phone ? user.phone : '',
      "Retailer's Name": user?.basicInformation?.personalDetails
        ? `${user?.basicInformation?.personalDetails?.firstName} ${user?.basicInformation?.personalDetails?.lastName}`
        : '',
      "Retailer's pin code": user && user.shopData ? user.shopData.pincode : '',
      City: user && user.shopData ? user.shopData.city : '',
      'Referred by Phone':
        user && user.referralData && user.referralData.refByPhone
          ? user.referralData.refByPhone
          : '',
      'Referred by Employee/Not':
        user.referralData &&
        user.referralData.refByUserType &&
        user.referralData.refByUserType.startsWith('EMPLOYEE')
          ? true
          : false,
      'Employee Manager phone':
        user && user.referralData && user.referralData.refByPhone
          ? employeeData.find((emp) => emp.mobileNumber === user.referralData.refByPhone && emp)
              ?.mobileNumber
          : '',
      'Employee Managers Manager phone':
        user && user.referralData && user.referralData.refByPhone
          ? employeeManagersData.find(
              (empManager) =>
                empManager.managerId ===
                  employeeData.find(
                    (emp) => emp.mobileNumber === user.referralData.refByPhone && emp
                  )?.managerId && empManager
            )?.mobileNumber
          : '',
      'State Head Name': '',
      'Date of purchase':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.startDate
          ? moment(user.shopData?.subscriptionData?.startDate).format('YYYY-MM-DD')
          : '',
      'Number of New Customer Tx':
        user &&
        user.shopData &&
        user.shopData.subscriptionData &&
        user.shopData.subscriptionData.length
          ? user.shopData?.subscriptionData?.length
          : 0,
    }));
    const fields = [
      "Retailer's Contact Number",
      "Retailer's Name",
      "Retailer's pin code",
      'City',
      'Referred by Phone',
      'Referred by Employee/Not',
      'Employee Manager phone',
      'Employee Managers Manager phone',
      'State Head Name',
      'Date of purchase',
      'Number of New Customer Tx',
    ];
    const data = await convertToCsv(reportData, fields, 'Transaction');

    sendEmailWithAttachments({
      to: [email.report],
      subject: ' Transaction Report',
      body: 'Please Find the attached report',
      attachments: [
        {
          // data: fs.readFileSync(`src/reports/${data.fileName}`, {
          //   encoding: "base64",
          // }),
          data: data.buffer,
          name: data.fileName,
        },
      ],
    });
    return { reportData, ...data };
  } catch (error) {
    console.log(error);
  }
};
const filteredMap = (filter, mapping) => {
  return (arr) =>
    Array.prototype.reduce.call(
      arr,
      (accumulator, value) => {
        if (filter(value)) accumulator.push(mapping(value));
        return accumulator;
      },
      []
    );
};
//const getOwners = filteredMap(dog => dog.breed == 'Pug', dog => dog.owner);
const generateReportEmployee = async (startDate, endDate) => {
  log.info({info: 'Report Service :: Inside generate Report Employee'})
  try {
    let from = moment()
      //.add(0, "days")
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let to = moment()
      //.add(1, "days")
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    if (
      startDate &&
      startDate != '' &&
      isDate(startDate) &&
      endDate &&
      endDate != '' &&
      isDate(endDate)
    ) {
      from = moment(startDate, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      to = moment(endDate, 'DD-MM-YYYY').endOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    //Get All Referal Data base on date range
    const employeeReferrals = await getEmployeeReferralsByUserIds(from, to);
    //return employeeReferrals;
    if (!employeeReferrals.length) return 'No data available within given date range';
    //Get All mobile number from Referal Data based on date range
    const mobileNumbers = employeeReferrals.map((emp) => emp.refByPhone);
    const empData = await getEmployeeByMobileNumbers(mobileNumbers);
    // return empData;
    const allemployees = await getEmployees();
    // const managerIds = empData.map((emp) => emp.managerId);
    // const filteredManagerIds = managerIds.filter(Boolean);
    // // console.log(filteredManagerIds);
    // const managers = allemployees.filter((emp) =>
    //   filteredManagerIds.includes(emp.managerId)
    // );
    // //return managers;
    // const managersManagerIds = managers.map((emp) => emp.managerId);
    // const filteredManagersManagerIds = managersManagerIds.filter(Boolean);
    // const managersManagers = allemployees.filter((emp) =>
    //   filteredManagersManagerIds.includes(emp.managerId)
    // );

    const reportData = empData.map((emp) => {
      return {
        'Employee phone': emp?.mobileNumber ? emp?.mobileNumber : '',
        'Pin code': emp?.pincode ? emp?.pincode : '',
        'Manager phone': allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)
          ?.mobileNumber
          ? allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.mobileNumber
          : '',
        "Manager's manager phone": allemployees.find(
          (allEmp) =>
            allEmp.employeeId ==
            allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.managerId
        )?.mobileNumber
          ? allemployees.find(
              (allEmp) =>
                allEmp.employeeId ==
                allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.managerId
            )?.mobileNumber
          : '',
        'Number of referrals sent': employeeReferrals?.filter(
          (ref) => ref.refByPhone == emp?.mobileNumber
        )?.length,
        'Number of subscriptions bought': employeeReferrals?.filter(
          (ref) =>
            ref.refByPhone == emp.mobileNumber &&
            ref.campaign &&
            'buy_subscription' in ref.campaign &&
            ref.campaign.buy_subscription.status
        )?.length,
        'Start date': from,
        'End date': to,
      };
    });
    // const employeeData = [];
    // for (let i = 0; i < empData.length; i++) {
    //   let managersPhone = [];
    //   let managerManagersPhone = [];
    //   for (let j = 0; j < managers.length; j++) {
    //     if (managers[j]["employeeId"] == empData[i]["managerId"]) {
    //       managersPhone.push(managers[j]["mobileNumber"]);
    //       managerManagersPhone = [];
    //       for (let k = 0; k < managersManagers.length; k++) {
    //         if (managers[j]["managerId"] == managersManagers[k]["employeeId"]) {
    //           managerManagersPhone.push(managersManagers[k]["mobileNumber"]);
    //         }
    //       }
    //     }
    //   }

    //   employeeData.push({
    //     //...empData[i],
    //     mobileNumber: empData[i].mobileNumber,
    //     pincode: empData[i]?.pincode ? empData[i]?.pincode : "",
    //     referrals: employeeReferrals.filter(
    //       (ref) => ref.refByPhone == empData[i].mobileNumber
    //     ),
    //     managersPhone: managersPhone.join(";"),
    //     managerManagersPhone: managerManagersPhone.join(";"),
    //   });
    // }
    // return employeeData;
    // const returnData = employeeData.map((emp) => {
    //   return {
    //     subscriptions: emp.referrals.filter(
    //       (ref) => ref.campaign && "buy_subscription" in ref.campaign
    //     ),
    //     ...emp,
    //   };
    // });

    // //return returnData;
    // const reportData = returnData.map((emp) => ({
    //   "Employee phone": emp.mobileNumber,
    //   "Pin code": emp?.pincode ? emp?.pincode : "",
    //   "Manager phone": emp.managersPhone ? emp.managersPhone : "",
    //   "Manager's manager phone": emp.managerManagersPhone
    //     ? emp.managerManagersPhone
    //     : "",
    //   "Number of referrals sent": emp?.referrals?.length,
    //   "Number of subscription bought": emp?.subscriptions?.length,
    //   "Start date": from,
    //   "End date": to,
    // }));
    const fields = [
      'Employee phone',
      'Pin code',
      'Manager phone',
      "Manager's manager phone",
      'Number of referrals sent',
      'Number of subscriptions bought',
      'Start date',
      'End date',
    ];
    const data = await convertToCsv(reportData, fields, 'Employee');
    //return reportData;
    sendEmailWithAttachments({
      to: email.report.split(','),
      subject: 'Sales Acquisition Report',
      body: 'Please Find the attached report',
      attachments: [
        {
          // data: fs.readFileSync(`src/reports/${data.fileName}`, {
          //   encoding: "base64",
          // }),
          data: data.buffer,
          name: data.fileName,
        },
      ],
    });
    return { reportData };
  } catch (error) {
    console.log(error);
  }
};

// const generateReports = async (startDate, endDate) => {
//   let reparaay=[];
//   const uniquerefby=[];
//   try {
//     let from = moment()
//       //.add(0, "days")
//       .startOf('day')
//       .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     let to = moment()
//       //.add(1, "days")
//       .endOf('day')
//       .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

//     if (
//       startDate &&
//       startDate != '' &&
//       isDate(startDate) &&
//       endDate &&
//       endDate != '' &&
//       isDate(endDate)
//     ) {
//       from = moment(startDate, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

//       to = moment(endDate, 'DD-MM-YYYY').endOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
//     }
//     console.log(from);
//     console.log(to);
//     //Get All Referal Data base on date range
//     const employeeReferrals = await getEmployeeReferralsByUserIds1(from, to);
//     let a=[],b=[],d=[],e=[],f=[];;

//     const finalarrray={};

//    console.log("\n\n===",employeeReferrals.length);
//     for(let i=0;i<employeeReferrals.length;i++){

//       // a[i]=employeeReferrals[i].phone_number;
//       // console.log(a[i]);
//       a[i]=employeeReferrals[i].refByPhone;
//       d[i]=employeeReferrals[i].createdAt;
//       f[i]=employeeReferrals[i].refByUserType;
//       let refByUserType=f[i];

//       let abc=a[i];
//       let craetedateandtime=d[i];

//       for(let y=0;y<uniquerefby.length || y<1 ;y++)
// {
//   console.log("===unique",uniquerefby[y]);
//   let count =0;
//   console.log("after_count== ",count)
//    for(let y=0;y<uniquerefby.length ;y++)
//    {
//     if(uniquerefby[y]!=abc){
//     count++;
//     }
//   }
//    console.log("after_count== ",count)
//   console.log("====abc",abc);
//  // if(uniquerefby[y]!=abc)
//   if(count==uniquerefby.length)

//   {
//   uniquerefby.push(abc);
//   console.log("after push",uniquerefby);

//       const ref_by_phone = (typeof abc === 'undefined') ? null : abc;

//  //  console.log("ref by phone",ref_by_phone);
//    //console.log("ref by refByUserType",refByUserType);
//    let orgids;
//    let mangerids;
//    let manager_names;
//    const a1="EMPLOYEE_SH";
//    const b1="EMPLOYEE_CO";
//    const c1="EMPLOYEE_SSO";
//    if(refByUserType === a1 || refByUserType === b1 || refByUserType === c1)
//       {

//       const empData = await getEmployeeByMobileNumbers(abc);
//  //     console.log("empData==lengrth------",empData.length);
//       for(let z=0; z<empData.length;z++)
//       {
//    let org_id=empData[z].org_id;
//       //  console.log(empData[0].org_id);
//       //  console.log(org_id);
//       // b[i]=empData[i].org_id;
//       // let org_id=b[i]

//       //console.log("org id",b[i]);
// // let org_ids=b[0];
//        orgids = (typeof org_id === 'undefined') ? null : org_id;
//       // console.log("org id",orgids);

//       // let c=[];
//       // c[i]=empData[i].managerId;
// let mangerid=empData[z].managerId;
//  mangerids = (typeof mangerid === 'undefined') ? null : mangerid;
// //console.log("manger id",mangerids);

//       // console.log("manger id",c[i]);

//     manager_name=await getmangerid(mangerid);

//    //console.log("manger name",manager_name[i].fullName)

//    let mangerfullname=manager_name[z].fullName;

//     manager_names = (typeof mangerfullname === 'undefined') ? null : mangerfullname;
//       }

//   }
//   else{

//     orgids=null;
//      mangerids=null;
//     manager_names=null;

//   }

//    let ref_by_user_id=employeeReferrals[i].ref_by;
//    let loc=employeeReferrals[i].location;
//    let longitudes;
//     let latitudes;
//    const location = (typeof loc === 'undefined') ? "null" : loc;
//    if(location!="null"){
//    let lat= a[i]=employeeReferrals[i].location.latitude;
//     latitudes = (typeof lat === 'undefined') ? "N/A" : lat;

//    let longi= a[i]=employeeReferrals[i].location.longitude;
//     longitudes = (typeof longi === 'undefined') ? "N/A" : longi;
//    }
//    else{
//     latitudes="null";
//     longitudes="null";

//    }

//                        //   const address=await getlatandlog(ref_by_user_id)
//                         //     //  console.log("longitude",address.location.longitude);
//                         // let longitude=address.location.longitude;

//                         // const longitudes = (typeof longitude === 'undefined') ? null : longitude;

//                         // let latitude=address.location.latitude;

//                         // let lat=address.location.latitude;
//                         // const latitudes = (typeof lat === 'undefined') ? null : lat;

//                         // //console.log("latitude",latitudes);

//       const getrefphone1 = await getrefphone12(abc,from,to)
//   //    console.log(getrefphone1.length);
//       for(let j=0;j<getrefphone1.length;j++)
//       {

//         let isSubscribed1;
//         let iskyc1 ;
//         let city1;
//         let state1;
//         let pincode1;
//         let txnamount;
//         let singup;
//         let iscatalog;
//         let categorys;
//        let  Vegetables,Fish,Restaurant,Dairy,Flowers,Bakery,Fruits,Meat,Grocery,Paan,PoojaItems,Sweets,HomeFoods,PetFoods;
//         let phones = getrefphone1[j].phone_number;

//         const ref_phone = (typeof phones === 'undefined') ? null : phones;
// //console.log("Referees (Referred to)",ref_phone);

// let type = getrefphone1[j].type;

// let ref_type = (typeof type === 'undefined') ? null : type;
// //console.log("type",ref_type);

// let userid= await getuserid(ref_phone)
//  //console.log("userid======",userid);
// //let user_ids = (typeof userid === 'undefined') ? "NOT" : userid;
// //  console.log(user_ids[0]._id);

// if(userid!='N/A')
// {

// // let user_id=userid[0]._id.toString();

// // let shopid1=userids[0]._id.toString();
// let shopid9=await getshopid1(userid)

// let result = getrefphone1[0].ratings;
// //console.log(result);
// var value =(!result) ? null : result;

// //console.log("rating",value);
// if(ref_type==="RETAILER")
//  singup=true;
//  else {
//    const sign_up = await getrefphone(ref_phone)
//    singup=sign_up;
//  }
// let result1 = getrefphone1[j].comments;
// var value1 = (typeof result1 === 'undefined') ? "n/a" : result1;

// for (const shop of shopid9) {
//   var isSubscribed = shop.isSubscribed;

//    isSubscribed1 = (typeof isSubscribed === 'undefined') ? null : isSubscribed;

//  var getshopid=shop.shop_id;

//   let shop_id=await getshopidfrommeta(getshopid)
//   if(shop_id===true)
//   {
//   let shop_category = await getshopcategory(getshopid)
//   console.log(shop_category.categories)
//   let cat=[];
//   // let category=["Vegetables","Fruits",]
//   let category1 = (typeof shop_category[0].category === 'undefined') ? null : shop_category[0].category;
//   if(!category1)
//   {
//   let category=shop_category[0].category;
//   categorys = (typeof category === 'undefined') ? null : category;
//  if(!categorys)
//  {

//   cat.push( shop_category[0].categories);
//   console.log(cat)
//   if(cat.length!=0)
//   {
//     for(let o=0;o<cat.length;o++)
//     {
//       if(cat[o]=='Vegetables')
//       {
//         Vegetables="yes";

//       }
//       else{
//         Vegetables="no";
//       }
//       if(cat[o]=='Fish')
//       {
//         Fish="yes";

//       }
//       else{
//         Fish="no";
//       }
//       if(cat[o]=='Restaurant')
//       {
//         Restaurant="yes";

//       }
//       else{
//         Restaurant="no";
//       }
//       if(cat[o]=='Dairy')
//       {
//         Dairy="yes";

//       }
//       else{
//         Dairy="no";
//       }
//       if(cat[o]=='Flowers')
//       {
//         Flowers="yes";

//       }
//       else{
//         Flowers="no";
//       }
//       if(cat[o]=='Bakery')
//       {
//         Bakery="yes";

//       }
//       else{
//         Bakery="no";
//       }
//       if(cat[o]=='Fruits')
//       {
//         Fruits="yes";

//       }
//       else{
//         Fruits="no";
//       }
//       if(cat[o]=='Meat')
//       {
//         Meat="yes";

//       }
//       else{
//         Meat="no";
//       }
//       console.log(cat[o]);
//       if(cat[o]=="Grocery")
//       {
//         Grocery="yes";

//       }
//       else{
//         Grocery="no";
//       }
//       if(cat[o]=='Paan')
//       {
//         Paan="yes";

//       }
//       else{
//         Paan="no";
//       }
//       if(cat[o]=='PoojaItems')
//       {
//         PoojaItems="yes";

//       }
//       else{
//         PoojaItems="no";
//       }
//       if(cat[o]=='Sweets')
//       {
//         Sweets="yes";

//       }
//       else{
//         Sweets="no";
//       }
//       if(cat[o]=='HomeFoods')
//       {
//         HomeFoods="yes";

//       }
//       else{
//         HomeFoods="no";
//       }
//       if(cat[o]=='PetFoods')
//       {
//         PetFoods="yes";

//       }
//       else{
//         PetFoods="no";
//       }
//     }

//     iscatalog=true;
//   }
//   else{
//     iscatalog=false;
//     }

//   }
//   }
//   // if(shop_id===true) {
//   //   iscatalog=true;
//   // }
//   // else{
//   //   iscatalog=false;
//   // }

// }
//   var iskyc=shop.isKYCVerified;
//    iskyc1 = (typeof iskyc === 'undefined') ? null : iskyc;

//    var city=shop.city;
//    city1 = (typeof city === 'undefined') ? null : city;

//    var state=shop.state;
//    state1 = (typeof state === 'undefined') ? null : state;

//    var pincode=shop.pincode;
//    pincode1 = (typeof pincode === 'undefined') ? null : pincode;
//   // do something with the isSubscribed value
//   //console.log(isSubscribed1)

//  // console.log(iskyc1)
//  if(isSubscribed1===true)
//    txnamount=399;

// }
// }
// else{
//  var temp='null';

//   isSubscribed1="null";
//   iskyc1 =temp;
//   txnamount=temp;
//   city1=temp;
//   state1=temp;
//   pincode1=temp;
//   singup=false;
//   iscatalog="null";
//   var temp1="no"
//   Vegetables=Fish=Restaurant=Dairy=Flowers=Bakery=Fruits=Meat=Grocery=Paan=PoojaItems=Sweets=HomeFoods=PetFoods=temp1;
// }

// let data={
//   'DateTime':craetedateandtime,
//   'Referred By':ref_by_phone,
//   'Org_id':orgids,
//   'Manager ID':mangerids,
//   'Manger Name':manager_names,
//   'Lat':latitudes,
//   'Long':longitudes,
//   'Referees (Referred to)':ref_phone,
//   'Type':ref_type,
//   'Rating':value,
//   'Comments':value1,
//   'SignUp':singup,
//   'isSubscribed':isSubscribed1,
//   'isKYCVerified':iskyc1,
//   'iscatalog':iscatalog,
//   'Txn Amount':txnamount,
//   'City':city1,
//   'State':state1,
//   'Pin Code':pincode1,
//   'Vegetables':Vegetables,
//   'Fish':Fish,
//   'Restaurant': Restaurant,
//   'Dairy':Dairy,
//   'Flowers':Flowers,
//   'Bakery':Bakery,
//   'Fruits':Fruits,
//   'Meat':Meat,
//   'Grocery':Grocery,
//   'Paan':Paan,
//   'Pooja Items':PoojaItems,
//   'Sweets':Sweets,
//   'Home Foods':HomeFoods,
//   'Pet Foods':PetFoods

// }

// // const fields = [
// //   'DateTime',
// //   'Referred By',
// //   'Org_id',
// //   'Manager ID',
// //   'Manger Name',
// //   'Lat',
// //   'Long',
// //   'Referees (Referred to)',
// //   'Type',
// //   'Rating',
// //   'Comments',
// //   'SignUp',
// //   'isSubscribed',
// //   'isKYCVerified',
// //   'iscatalog',
// //   'Txn Amount',
// //   'City',
// //   'State',
// //   'Pin Code',
// //   'Vegetables',
// //   'Fish',
// //   'Restaurant',
// //   'Dairy',
// //   'Flowers',
// //   'Bakery',
// //   'Fruits',
// //   'Meat',
// //   'Grocery',
// //   'Paan',
// //   'Pooja Items',
// //   'Sweets',
// //   'Home Foods',
// //   'Pet Foods',
// // ];

// console.log(data);
// reparaay.push(data)
// }
//     }
//     else{

//     }

// }
// }
// }
//   catch(e) {
//     console.log(e);
//   }
//   console.log(reparaay.length)

//   console.log(reparaay)

//   return reparaay;

// };
const generateReports10 = async () => {
  log.info({info: 'Report Service :: Inside generate Reports10'})
  
  const getshop_deatils = await getshopdeatils();

  let user = [];
  let phone;
  for (let i = 0; i < getshop_deatils.length; i++) {
    let userid = getshop_deatils[i].user_id;
    const user_id = await userids(userid);
    let users_ids = typeof user_id === 'undefined' ? 'N/A' : user_id;
    if (users_ids == null) {
      phone = 'null';
    } else {
      phone = user_id.phone;
    }

    let data = {
      shop_id: getshop_deatils[i].shop_id,
      user_id: getshop_deatils[i].user_id,
      shop_name: getshop_deatils[i].shop_name,
      longitude: getshop_deatils[i].longitude,
      latitude: getshop_deatils[i].latitude,
      shop_number: getshop_deatils[i].shop_number,
      locality: getshop_deatils[i].locality,
      landmark: getshop_deatils[i].landmark,
      city: getshop_deatils[i].city,
      street: getshop_deatils[i].street,
      veg: getshop_deatils[i].veg,
      delivery: getshop_deatils[i].delivery,
      image: getshop_deatils[i].image,
      type_of_retailer: getshop_deatils[i].type_of_retailer,
      GST_no: getshop_deatils[i].GST_no,
      isSubscribed: getshop_deatils[i].isSubscribed,
      isKYCVerified: getshop_deatils[i].isKYCVerified,
      selling_type: getshop_deatils[i].selling_type,
      'Pin Code': getshop_deatils[i].pincode,
      created_at: getshop_deatils[i].created_at,
      updated_at: getshop_deatils[i].updated_at,
      id: getshop_deatils[i].id,
      state: getshop_deatils[i].state,
      region: getshop_deatils[i].region,
      manager_id: getshop_deatils[i].manager_id,
      hasDummySub: getshop_deatils[i].hasDummySub,
      min_order_value: getshop_deatils[i].min_order_value,
      guid: getshop_deatils[i].guid,
      shop_status: getshop_deatils[i].shop_status,
      phone: phone,
    };

    user.push(data);
  }
  return user;
};
const generateReportsale = async (startDate, endDate) => {
  try {
    let from = moment()
      //.add(0, "days")
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let to = moment()
      //.add(1, "days")
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    if (
      startDate &&
      startDate != '' &&
      isDate(startDate) &&
      endDate &&
      endDate != '' &&
      isDate(endDate)
    ) {
      from = moment(startDate, 'DD-MM-YYYY').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      to = moment(endDate, 'DD-MM-YYYY').endOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
    }
    //Get All Referal Data base on date range
    const employeeReferrals = await getEmployeeReferralsByUserIds(from, to);

    //return employeeReferrals;
    if (!employeeReferrals.length) return 'No data available within given date range';
    //Get All mobile number from Referal Data based on date range
    const mobileNumbers = employeeReferrals.map((emp) => emp.refByPhone);
    const empData = await getEmployeeByMobileNumbers(mobileNumbers);
    // return empData;
    const allemployees = await getEmployees();
    // const managerIds = empData.map((emp) => emp.managerId);
    // const filteredManagerIds = managerIds.filter(Boolean);
    // // console.log(filteredManagerIds);
    // const managers = allemployees.filter((emp) =>
    //   filteredManagerIds.includes(emp.managerId)
    // );
    // //return managers;
    // const managersManagerIds = managers.map((emp) => emp.managerId);
    // const filteredManagersManagerIds = managersManagerIds.filter(Boolean);
    // const managersManagers = allemployees.filter((emp) =>
    //   filteredManagersManagerIds.includes(emp.managerId)
    // );

    const reportData = empData.map((emp) => {
      return {
        'Employee phone': emp?.mobileNumber ? emp?.mobileNumber : '',
        'Pin code': emp?.pincode ? emp?.pincode : '',
        'Manager phone': allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)
          ?.mobileNumber
          ? allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.mobileNumber
          : '',
        "Manager's manager phone": allemployees.find(
          (allEmp) =>
            allEmp.employeeId ==
            allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.managerId
        )?.mobileNumber
          ? allemployees.find(
              (allEmp) =>
                allEmp.employeeId ==
                allemployees.find((allEmp) => allEmp.employeeId == emp.managerId)?.managerId
            )?.mobileNumber
          : '',
        'Number of referrals sent': employeeReferrals?.filter(
          (ref) => ref.refByPhone == emp?.mobileNumber
        )?.length,
        'Number of subscriptions bought': employeeReferrals?.filter(
          (ref) =>
            ref.refByPhone == emp.mobileNumber &&
            ref.campaign &&
            'buy_subscription' in ref.campaign &&
            ref.campaign.buy_subscription.status
        )?.length,
        'Start date': from,
        'End date': to,
      };
    });
    // const employeeData = [];
    // for (let i = 0; i < empData.length; i++) {
    //   let managersPhone = [];
    //   let managerManagersPhone = [];
    //   for (let j = 0; j < managers.length; j++) {
    //     if (managers[j]["employeeId"] == empData[i]["managerId"]) {
    //       managersPhone.push(managers[j]["mobileNumber"]);
    //       managerManagersPhone = [];
    //       for (let k = 0; k < managersManagers.length; k++) {
    //         if (managers[j]["managerId"] == managersManagers[k]["employeeId"]) {
    //           managerManagersPhone.push(managersManagers[k]["mobileNumber"]);
    //         }
    //       }
    //     }
    //   }

    //   employeeData.push({
    //     //...empData[i],
    //     mobileNumber: empData[i].mobileNumber,
    //     pincode: empData[i]?.pincode ? empData[i]?.pincode : "",
    //     referrals: employeeReferrals.filter(
    //       (ref) => ref.refByPhone == empData[i].mobileNumber
    //     ),
    //     managersPhone: managersPhone.join(";"),
    //     managerManagersPhone: managerManagersPhone.join(";"),
    //   });
    // }
    // return employeeData;
    // const returnData = employeeData.map((emp) => {
    //   return {
    //     subscriptions: emp.referrals.filter(
    //       (ref) => ref.campaign && "buy_subscription" in ref.campaign
    //     ),
    //     ...emp,
    //   };
    // });

    // //return returnData;
    // const reportData = returnData.map((emp) => ({
    //   "Employee phone": emp.mobileNumber,
    //   "Pin code": emp?.pincode ? emp?.pincode : "",
    //   "Manager phone": emp.managersPhone ? emp.managersPhone : "",
    //   "Manager's manager phone": emp.managerManagersPhone
    //     ? emp.managerManagersPhone
    //     : "",
    //   "Number of referrals sent": emp?.referrals?.length,
    //   "Number of subscription bought": emp?.subscriptions?.length,
    //   "Start date": from,
    //   "End date": to,
    // }));
    const fields = [
      'Employee phone',
      'Pin code',
      'Manager phone',
      "Manager's manager phone",
      'Number of referrals sent',
      'Number of subscriptions bought',
      'Start date',
      'End date',
    ];
    const data = await convertToCsv(reportData, fields, 'Employee');
    //return reportData;
    sendEmailWithAttachments({
      to: email.report.split(','),
      subject: 'Sales Acquisition Report',
      body: 'Please Find the attached report',
      attachments: [
        {
          // data: fs.readFileSync(`src/reports/${data.fileName}`, {
          //   encoding: "base64",
          // }),
          data: data.buffer,
          name: data.fileName,
        },
      ],
    });
    return { reportData };
  } catch (error) {
    console.log(error);
  }
};
const getStores = async (startDate, endDate) => {
  log.info({info: 'Report Service :: Inside get Stores'})

  return await Shop.shopLists(startDate, endDate);
};
const getStoresByUserIds = async (userIds) => {
  log.info({info: 'Report Service :: Inside get Stores By UserIds'})
  return await Shop.shopListsByUserIds(userIds);
};
const generateReport = async () => {};

const convertToCsv = async (jsonData, fields, fileName) => {
  const opts = { fields, header: true };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(jsonData);
    //await writeFile(`src/reports/${fileName}_${getDatetime()}.csv`, csv);

    return {
      message: 'Report generated successfully',
      fileName: `${fileName}_${getDatetime()}.csv`,
      data: csv,
      buffer: Buffer.from(csv),
    };
  } catch (err) {
    return err;
  }
};
const isExists = async (path) => {
  try {
    await fsPromise.access(path);
    return true;
  } catch {
    return false;
  }
};

const writeFile = async (filePath, data) => {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isExists(dirname);
    if (!exist) {
      await fsPromise.mkdir(dirname, { recursive: true });
    }

    await fsPromise.writeFile(filePath, data, 'utf8');
  } catch (err) {
    throw new Error(err);
  }
};
const getDatetime = () => {
  const date = new Date();
  return `${date
    .toDateString()
    .replace(/ /g, '_')}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
};

const getOrderAggregationReport = async (shopId, startDate, endDate) => {
  log.info({info: 'Report Service :: Inside get Order Aggregation Report'})

  try {
    let from = moment(startDate)
      //.add(0, "days")
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let to = moment(endDate)
      //.add(1, "days")
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const db = mongoose.connection.useDb('oms');
    const data = await db
      .collection('suborders')
      .find({
        shopId: shopId,
        status: { $in: ['ACCEPTED', 'NEW'] },
        'delivery.deliveryDate': startDate,
        // createdAt: {
        //   $gte: new Date(from),
        //   $lt: new Date(to),
        // },
      })
      .toArray();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getOrders = async (shopId, startDate, endDate) => {
  log.info({info: 'Report Service :: Inside get Orders'})

  let from = moment(startDate)
    //.add(0, "days")
    .startOf('day')
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  let to = moment(endDate)
    //.add(1, "days")
    .endOf('day')
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  const db = mongoose.connection.useDb('oms');
  const data = await db
    .collection('suborders')
    .find({
      shopId,
      status: { $ne: 'CANCELLED' },
      createdAt: {
        $gte: new Date(from),
        $lt: new Date(to),
      },
    })
    .sort({ createdAt: -1 })
    .toArray();
  return data;
};

const getTopCustomerReport = async (userId) => {
  log.info({info: 'Report Service :: Inside get Top Customer Report'})

  try {
    const db = mongoose.connection.useDb('ums');
    const data = await db.collection('users').find({ _id: id }).toArray();
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getUserDetailedOrders = async (shopId, userId, startDate, endDate) => {
  log.info({info: 'Report Service :: Inside get User Detailed Orders'})

  try {
    let from = moment(startDate)
      //.add(0, "days")
      .startOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let to = moment(endDate)
      //.add(1, "days")
      .endOf('day')
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const omsDb = mongoose.connection.useDb('oms');
    const orderData = await omsDb
      .collection('suborders')
      .find({
        shopId: shopId,
        userID: userId,
        status: { $ne: 'CANCELLED' },
        createdAt: {
          $gte: new Date(from),
          $lt: new Date(to),
        },
      })
      .toArray();

    return orderData;
  } catch (error) {
    console.log(error);
  }
};

const getUserData = async (userId) => {
  log.info({info: 'Report Service :: Inside getUser Data'})
  try {
    const umsDb = mongoose.connection.useDb('ums');
    const userData = await umsDb
      .collection('users')
      .find({
        _id: new ObjectId(userId),
      })
      .toArray();
    return userData;
  } catch (error) {
    console.log(error);
  }
};

const getAllEmployees = async (userId) => {
  try {
    const umsDb = mongoose.connection.useDb('ums');
    const userData = await umsDb.collection('employees').find({}).toArray();
    return userData;
  } catch (error) {
    console.log(error);
  }
};

const getAllShops = async () => {
  try {
    const result = await Shop.getshopids();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async () => {
  try {
    const umsDb = mongoose.connection.useDb('ums');
    const userData = await umsDb.collection('users').find({}).toArray();
    return userData;
  } catch (error) {
    console.log(error);
  }
};

const getAllReferrals = async (from, to) => {
  try {
    const db = mongoose.connection.useDb('ref_ms');
    return db
      .collection('referrals')
      .find({
        refByUserType: new RegExp('^EMPLOYEE.*$'),
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to),
        },
      })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getOrders,
  getUsers,
  generateReport,
  generateReportCatalog,
  generateReportSubscription,
  generateReportTxn,
  generateReportEmployee,
  getStoresByUserIds,
  getReferrals,
  getOrderAggregationReport,
  getTopCustomerReport,
  getUserDetailedOrders,
  getUserData,
  // generateReports,
  generateReports10,
  getReferral,
  getEmployeeByMobileNumbers,
  getManagerId,
  getRefPhone,
  getUserId,
  getShopDetails,
  getrefphone,
  // getCatagories,
  // getshopcategory,
  getAllEmployees,
  getAllShops,
  getCatalog,
  getAllUsers,
  getAllReferrals,
};
