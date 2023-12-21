const axios = require('axios');
const { loadBalancer, system_token } = require('@config');
// const { system_token } = require('@config');
// const loadBalancer = "http://localhost:1207"
const { DATA_BASE_ERROR } = require('../../errors');
const { Logger } = require('sarvm-utility');

const getShopOwnerDetails = async (userIds,length) => {
  const userNos = 100;
  let userLoads = []
  let users = userIds.split(";")
  for (let i = 0; i < users.length; i += userNos) {
    userLoads.push(users.slice(i, i + userNos))
  }
  try {
    Logger.info({ info: 'ums api call' });
    let response = []
    for (let i = 0; i < userLoads.length; i++) {
      const config = {
        method: 'get',
        url: `${loadBalancer}/ums/apis/v1/users?userIds=${userLoads[i].join(";")}&pageSize=${length}`,
        headers: {
          app_name: 'retailerApp',
          app_version_code: '101',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${system_token}`,
        },
      };

      const result = await axios(config);
      if (result != null) {
        if (result.data != null) {
          if (result.data.data != null) {
            response.push(...result.data.data.result);
          }
        }
      }

    }
    return response

  } catch (error) {
    throw new DATA_BASE_ERROR(error);
  }
}

const getUserDetails = async (user_id) => {
  try {
    Logger.info({ info: 'ums api call' });
    const config = {
      method: 'get',
      url: `${loadBalancer}/ums/apis/v1/users/${user_id}`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${system_token}`,
      },
    };
    const { data } = await axios(config);
    if (data) {
      return data.data;
    }
    return null;
  } catch (error) {
    throw new DATA_BASE_ERROR(error);
  }
};

const createUser = async (args) => {
  try {
    Logger.info({ info: 'ums api call' });
    const config = {
      method: 'post',
      url: `${loadBalancer}/ums/apis/v1/users/createUser`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${system_token}`,
      },
      data: JSON.stringify(args),
    };

    const { data } = await axios(config);
    if (data) {
      return data.data._id;
    }
    return null;
  } catch (error) {
    throw new DATA_BASE_ERROR(error);
  }
};

module.exports = {
  getShopOwnerDetails,
  getUserDetails,
  createUser,
};
