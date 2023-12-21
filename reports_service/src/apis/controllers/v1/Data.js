const { DataService } = require('@root/src/apis/services/v1');
const {
  Logger: log,
} = require('sarvm-utility');

const getEmployees = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get Employees'})
  const data = await DataService.getEmployees({ startDate, endDate });
  return data;
};

const getSubscriptions = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get Subscriptions'})
  const data = await DataService.getSubscriptions({ startDate, endDate });
  return data;
};

const getReferral = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get Referral'})
  const data = await DataService.getReferral({ startDate, endDate });
  return data;
};

const getReward = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get Reward'})

  const data = await DataService.getReward({ startDate, endDate });
  return data;
};

const getUserData = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get UserData '})

  const data = await DataService.getUserData({ startDate, endDate });
  return data;
};

const getShop = async ({ startDate, endDate }) => {
  log.info({info: 'Data  Controller :: Inside get Shop '})

  const data = await DataService.getShop({ startDate, endDate });
  return data;
};
const getstoremetadata =async(shop_id)=>{

  const data = await DataService.getcatalogdata(shop_id);
 
 let output=[];
  let newData = data.map((item) => {
   
    const metaData={
      version: item.version,
      url: item.url
    };

    output.push(metaData)
    
  });
 
  return output;
};

module.exports = {
  getEmployees,
  getSubscriptions,
  getReferral,
  getReward,
  getUserData,
  getShop,
  getstoremetadata,
};
