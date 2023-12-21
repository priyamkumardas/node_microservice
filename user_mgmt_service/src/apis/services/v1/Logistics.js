const { systemToken } = require("@root/src/config");
const { default: axios } = require("axios");

const createDeliveryBoy = async (args) => {
    console.log("user id is", args)
    try {
        const config = {
          method: 'post',
          url: `http://localhost:1200/lms/apis/v1/deliveryBoy/create`,
          headers: {
            app_name: 'logisticsDelivery',
            app_version_code: '101',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${systemToken}`,
          },
          data: {
            userId: args.userId
          }
        };
        const result = await axios(config);
        console.log(result.data)
        if (result?.data) {
          return result.data;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        // throw new ORDER_SERVICE_ERROR(error);
      }
}


module.exports = {
    createDeliveryBoy
}