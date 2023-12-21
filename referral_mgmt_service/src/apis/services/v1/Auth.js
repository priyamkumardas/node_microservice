const { system_token, load_balancer } = require("@root/src/config");
const {
    RequestHandler,
    ErrorHandler: { INTERNAL_SERVER_ERROR },
  } = require("sarvm-utility");
const axios = require('axios')

const getAuthToken = async (userId) => {
    const options = {
        headers: {
          app_name: "logisticsDelivery",
          app_version_code: 101,
          "Content-Type": "application/json",
          Authorization: `Bearer ${system_token}`,
        },

      };
      let res = null;
      const url = `${load_balancer}/auth/apis/v1/token/${userId}`
      try {
        res = await axios.get(url, options)
        return res.data.data.accessToken;
        // if(res.data && res.data.length > 0) { 
        //     return res.data;
        // } else {
        //     return []
        // }
      } catch(error) {
        throw new INTERNAL_SERVER_ERROR();
      }
  }

module.exports = {
    getAuthToken
}