const axios = require('axios');
const { loadBalancer, systemToken } = require('@config');

// const updateDummySubscription = async (userId) => {
//   try {
//     const config = {
//       method: 'patch',
//       url: `${loadBalancer}/rms/apis/v1/shop/dummySubscription?userId=${userId}`,
//       headers: {
//         app_name: 'retailerApp',
//         app_version_code: '101',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${system_token}`,
//       },
//       data: {
//         hasDummySub: `true`,
//       },
//     };
//     const result = await axios(config);
//     if (result != null) {
//       if (result.data != null) {
//         if (result.data.data != null) {
//           return result.data.data;
//         }
//       }
//     }
//     return null;
//   } catch (error) {
//     console.log(error);
//     // throw new ORDER_SERVICE_ERROR(error);
//   }
// };

const getRefereeDetails = async (phone) => {
    try {
        const config = {
            method: 'get',
            url: `${loadBalancer}/ref_ms/apis/v1/ref/referee/${phone}`,
            headers: {
                app_name: 'householdApp',
                // app_version_code: '101',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${systemToken}`,
              }
        }
        const result = await axios(config);
        const data = result.data.data;
        if(data != null) {
            return data;
        } else {
            return null;
        }
    } catch(error) {
        console.log("inside error", error)
        // console.log('error is', error)
        return null;
    }

}

const sendReferInvite = async (args, token) => {
    
    
    let { phone, type, lat, lon } = args
    console.log(phone, type)
    try {
        
        const config = {
            method: 'post',
            url: `${loadBalancer}/ref_ms/apis/v1/ref/invite/`,
            data: {
                phone: phone,
                type: type,
            },
            headers: {
                app_name: 'householdApp',
                // app_version_code: '101',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                lat: lat,
                lon: lon
              }
        }
        const result = await axios(config);
        console.log("result is", result.data)
        const data = result.data;
        if(data != null) {
            return data;
        } else {
            return null;
        }
    } catch(error) {
    //    console.log("inside error", error)
        // console.log('error is', error)
        console.log("inside error")
        return null;
    }
}



module.exports = {
  getRefereeDetails,
  sendReferInvite, 
};
