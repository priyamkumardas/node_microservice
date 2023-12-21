/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const moment = require('moment');
const WorkingHoursServices = require('@services/v1/WorkingHoursServices');
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const DayId = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};
const getResponse = async (result) => {
  log.info({info: 'Retailer Controller :: Inside get response'})
  const response = [];
  const sunday = [];
  let isSundayActive = false;
  const monday = [];
  let isMondayActive = false;
  const tuesday = [];
  let isTuesdayActive = false;
  const wednesday = [];
  let isWednesdayActive = false;
  const thursday = [];
  let isThursdayActive = false;
  const friday = [];
  let isFridayActive = false;
  const saturday = [];
  let isSaturdayActive = false;

  for (let i = 0; i < result.length; i += 1) {
    const rem = Math.floor(result[i].start_time / 1440);
    const s_hour = Math.floor((result[i].start_time % 1440) / 60);
    const s_min = (result[i].start_time % 1440) % 60;

    const e_hour = Math.floor((result[i].end_time % 1440) / 60);
    const e_min = (result[i].end_time % 1440) % 60;

    if (rem <= 0) {
      isSundayActive = result[i].is_active;

      sunday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min} `,
      });
    } else if (rem <= 1) {
      isMondayActive = result[i].is_active;

      monday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    } else if (rem <= 2) {
      isTuesdayActive = result[i].is_active;
      tuesday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    } else if (rem <= 3) {
      isWednesdayActive = result[i].is_active;
      wednesday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    } else if (rem <= 4) {
      isThursdayActive = result[i].is_active;
      thursday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    } else if (rem <= 5) {
      isFridayActive = result[i].is_active;
      friday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    } else if (rem <= 6) {
      isSaturdayActive = result[i].is_active;
      saturday.push({
        startTime: `${s_hour}:${s_min}`,
        endTime: `${e_hour}:${e_min}`,
      });
    }
  }

  if (sunday.length >= 1) {
    response.push({
      dName: 'SUN',
      isEnable: isSundayActive,
      alltime: sunday,
    });
  }
  if (monday.length >= 1) {
    response.push({
      dName: 'MON',
      isEnable: isMondayActive,
      alltime: monday,
    });
  }
  if (tuesday.length >= 1) {
    response.push({
      dName: 'TUE',
      isEnable: isTuesdayActive,
      alltime: tuesday,
    });
  }
  if (wednesday.length >= 1) {
    response.push({
      dName: 'WED',
      isEnable: isWednesdayActive,
      alltime: wednesday,
    });
  }
  if (thursday.length >= 1) {
    response.push({
      dName: 'THU',
      isEnable: isThursdayActive,
      alltime: thursday,
    });
  }
  if (friday.length >= 1) {
    response.push({
      dName: 'SUN',
      isEnable: isFridayActive,
      alltime: friday,
    });
  }
  if (saturday.length >= 1) {
    response.push({
      dName: 'SUN',
      isEnable: isSaturdayActive,
      alltime: saturday,
    });
  }

  return response;
};
const createRecords = async (args, shopid) => {
  log.info({info: 'Retailer Controller :: Inside create records'})
  try {
    const { workingHours } = args;
    const records = [];

    for (let i = 0; i < workingHours.length; i += 1) {
      const { dName, isEnable, alltime } = workingHours[i];
      for (let j = 0; j < alltime.length; j += 1) {
        const { startTime, endTime } = alltime[j];

        const start_hour = moment(startTime).format('HH');
        const start_min = moment(startTime).format('mm');
        const start_time = 1440 * DayId[dName] + start_hour * 60 + start_min * 1;

        const end_hour = moment(endTime).format('HH');
        const end_min = moment(endTime).format('mm');
        const end_time = 1440 * DayId[dName] + end_hour * 60 + end_min * 1;

        records.push({
          shop_id: shopid,
          start_time,
          end_time,
          is_active: isEnable,
        });
      }
    }
    const result = await WorkingHoursServices.createRecords(records, shopid);

    const response = await getResponse(result);
    return response;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const findAvailableUsers = async () => {
  try {
    const now = new Date();
    const day = parseInt(now.getDay(), 10);
    const hour = parseInt(now.getHours(), 10);
    const currentTime = parseInt(hour + 24 * day, 10);
    const result = await WorkingHoursServices.findAvailableUsers(currentTime);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const findAllOpenShop = async (start_time, end_time, day) => {
  log.info({info: 'Retailer Controller :: Inside find all open shop'})
  try {
    const startTime = start_time + 24 * DayId[day];
    const endTime = end_time + 24 * DayId[day];

    const result = await WorkingHoursServices.findAllShopOpenInTime(startTime, endTime);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getRecords = async (shopId) => {
  log.info({info: 'Retailer Controller :: Inside get records'})
  try {
    const result = await WorkingHoursServices.getShopTiming(shopId);
    const data = getResponse(result);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteRecords = async (args) => {
  log.info({info: 'Retailer Controller :: Inside delete records'})
  try {
    const result = await WorkingHoursServices.deleteRecords(args);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const toggleStatus = async (args) => {
  log.info({info: 'Retailer Controller :: Inside toggle status'})
  try {
    const result = await WorkingHoursServices.toggleStatus(args);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  createRecords,
  findAvailableUsers,
  deleteRecords,
  toggleStatus,
  getRecords,
  findAllOpenShop,
};
