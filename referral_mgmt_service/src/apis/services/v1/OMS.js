const {
    RequestHandler,
    ErrorHandler: { INTERNAL_SERVER_ERROR },
  } = require("sarvm-utility");
  
  const axios = require("axios");
  
  const { load_balancer, system_token } = require("@root/src/config");
const { getAuthToken } = require("./Auth");
  
  const RMS_GETSHOP = load_balancer + "/rms/apis/v1/shop";
  
  const getShopDetails = async (userId) => {
    const options = {
      headers: {
        app_name: "householdApp",
        app_version_code: 101,
        "Content-Type": "application/json",
        Authorization: `Bearer ${system_token}`,
      },
      data: {
        userId: userId,
      },
    };
    let res = {};
    try {
      res = await axios.get(RMS_GETSHOP, options);
    } catch (err) {
      console.log("GET SHOP ERROR");
      console.log(err);
      throw new Error(JSON.stringify(err.response.data));
    }
    const { success, data: result, error } = res.data;
    if (success) {
      if (result[0]) {
        return result[0];
      } else {
        return "000000";
      }
    } else {
      throw new Error(error.code);
    }
  };

  const getAllOrderByUserId = async (userId) => {
    const options = {
        headers: {
          app_name: "householdApp",
          app_version_code: 101,
          "Content-Type": "application/json",
          Authorization: `Bearer ${system_token}`,
        },
        data: {
          userId: userId,
        },
      };
      console.log("user id is", userId)
      let res = null;
      const url = `${load_balancer}/oms/apis/v1/household`
      try {
        res = await axios.get(url, options)
        return res.data.data.length > 0 ? res.data.data : []
        // if(res.data && res.data.length > 0) { 
        //     return res.data;
        // } else {
        //     return []
        // }
      } catch(error) {
        console.log(error)
        throw new INTERNAL_SERVER_ERROR();
      }
  }

  const getTripDetailsByDeliveryBoyId = async (deliveryBoyId) => {

    //get auth token for logistics person
    let la_token = null;
    try {
      la_token = await getAuthToken(deliveryBoyId)
      console.log("la token is", la_token)

    } catch(error) {
      console.log("inside la error")
      throw new INTERNAL_SERVER_ERROR("Error while getting token from Auth Service")
    }
    return [];   
    // const options = {
    //     headers: {
    //       app_name: "householdApp",
    //       app_version_code: 101,
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${la_token}`,
    //     },

    //   };
    //   let res = null;
    //   const url = `${load_balancer}/lms/apis/v1/trip`
    //   try {
    //     res = await axios.get(url, options)
    //     return res.data.data.length > 0 ? res.data.data : []
    //     // if(res.data && res.data.length > 0) { 
    //     //     return res.data;
    //     // } else {
    //     //     return []
    //     // }
    //   } catch(error) {
    //     console.log(error)
    //     throw new INTERNAL_SERVER_ERROR();
    //   }
  }

  const getAllOrderByRetailerId = async (retailerId) => {
    const options = {
        headers: {
          app_name: "householdApp",
          app_version_code: 101,
          "Content-Type": "application/json",
          Authorization: `Bearer ${system_token}`,
        },

      };
      let res = null;
      const url = `${load_balancer}/oms/apis/v1/household/orders/${retailerId}`
      try {
        res = await axios.get(url, options)
        return res.data.data.length > 0 ? res.data.data : []

      } catch(error) {
        console.log(error)
        throw new INTERNAL_SERVER_ERROR();
      }
  }

  module.exports = {
    getAllOrderByUserId,
    getAllOrderByRetailerId, 
    getTripDetailsByDeliveryBoyId
  };
  