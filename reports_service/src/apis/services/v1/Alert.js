const { sendEmail } = require("@root/src/common/libs/Email/sesSendEmail");
const moment = require("moment");
const { email } = require("@root/src/config");
const { default: mongoose } = require("mongoose");
const { getStoresByUserIds } = require("./Report");
const { isDate } = require("@root/src/common/utility/dateUtil");
const {
  Logger:log
} = require("sarvm-utility");
const getUser = async (userId) => {
  try {
    const db = mongoose.connection.useDb("ums");
    return await db
      .collection("users")
      .findOne({ _id: mongoose.Types.ObjectId(userId) });
  } catch (err) {
    console.log(err);
  }
};
const getReferral = async (phone) => {
  try {
    const db = mongoose.connection.useDb("ref_ms");
    return await db.collection("referrals").findOne({ phone_number: phone });
  } catch (err) {
    console.log(err);
  }
};
const getSubscriptionByUserId = async (userId) => {
  try {
    const db = mongoose.connection.useDb("sub");
    return await db.collection("subscription").findOne({
      userId: userId,
    });
  } catch (err) {
    console.log(err);
  }
};
const getManagerDetails = async (key, value) => {
  try {
    const db = mongoose.connection.useDb("ums");
    let query = {};
    if (key && key != "" && value && value != "") {
      query[key] = value;
    }
    return await db.collection("employees").findOne(query);
  } catch (err) {
    console.log(err);
  }
};
const alertSubscription = async (userId) => {
  log.info({info: 'Alert Service :: Inside alert Subscription'})
  try {
    const user = await getUser(userId);
    let reportData = {};
    if (user) {
      const referrer = await getReferral(user?.phone);
      const shop = await getStoresByUserIds([userId]);
      const sub = await getSubscriptionByUserId(userId);
      let referredByPhone = "NA";
      let referredByEmployee = "No";
      let managersPhone = "NA";
      let managersManagerPhone = "NA";
      let amount = "";
      let stateHeadName = "NA";
      let date = "";
      if (referrer) {
        if (referrer.refByPhone) {
          referredByPhone = referrer.refByPhone;
          const refEmployeeeDetails = await getManagerDetails(
            "mobileNumber",
            referrer.refByPhone
          );
          //console.log(managerData);
          if (refEmployeeeDetails && refEmployeeeDetails.managerId) {
           const managerData = await getManagerDetails(
              "employeeId",
              refEmployeeeDetails.managerId
            )
            if (managerData && managerData.mobileNumber) {
            managersPhone = managerData.mobileNumber;
            }
          
          if (managerData && managerData.role == "SH") {
            stateHeadName = managerData.fullName;
          }
          if (managerData && managerData.managerId) {
            let managersManager = await getManagerDetails(
              "employeeId",
              managerData.managerId
            );
            if (managersManager && managersManager.mobileNumber) {
              managersManagerPhone = managersManager.mobileNumber;
            }
            if (managersManager && managersManager.role == "SH") {
              stateHeadName = managersManager.fullName;
            }
          }
        }
        }

        
        if (
          referrer.refByUserType &&
          referrer.refByUserType.startsWith("EMPLOYEE")
        ) {
          referredByEmployee = "Yes";
        }
        }
        if (sub && sub.paid) {
          // console.log(referrer.campaign.buy_subscription);
           amount = sub.amount;
           date = sub.startDate;
         }
      
      if (date && isDate(date)) {
        date = moment(date).utc().format("YYYY-MM-DD");
      }
      let emailData = {
        retailerContactNumber: user && user.phone ? user.phone : "",
        retailersName: user?.basicInformation?.personalDetails
          ? `${user?.basicInformation?.personalDetails?.firstName} ${user?.basicInformation?.personalDetails?.lastName}`
          : "",
        retailerShopName: shop[0]?.shop_name?shop[0]?.shop_name:"",
        retailerPinCode: shop[0]?.pincode?shop[0]?.pincode:"",
        city: shop[0]?.city?shop[0]?.city:"",
        referredByPhone: referredByPhone,
        referredByEmployee: referredByEmployee,
        employeeManagerPhone: managersPhone,
        employeeManagersManagerPhone: managersManagerPhone,
        stateHeadName: stateHeadName,
        amountPaid: amount,
        //DateOfPurchase1: date.toDateString(),
        DateOfPurchase: date ? date : "",

        // DateOfPurchase: date
        //   ? moment(new Date(date.setHours(0, 0, 0, 0))).format("YYYY-MM-DD")
        //   : "",
        state: shop[0]?.state ? shop[0]?.state : "",
      };
      // return emailData;
      let direct = referredByEmployee=="Yes" ? "" : "Direct -";
      reportData = {
        emailSubject: `Alert Subscription - ${direct} ${emailData.state} - ${emailData.retailerPinCode} - ${emailData.retailerContactNumber}   ${emailData.retailersName}`,
        emailBody: `<span style="white-space: pre-line">Retailer's Contact Number: ${emailData.retailerContactNumber}\r\n
        Retailer's Name: ${emailData.retailersName}\r\n
        Retailer's Shop Name: ${emailData.retailerShopName}\r\n
        Retailer PinCode: ${emailData.retailerPinCode}\r\n
        City: ${emailData.city}\r\n
        Referred By Phone: ${emailData.referredByPhone}\r\n
        Referred By Employee:  ${emailData.referredByEmployee}\r\n
        Employee Manager Phone: ${emailData.employeeManagerPhone}\r\n
        Employee Manager's Manager Phone: ${emailData.employeeManagersManagerPhone}\r\n
        State Head Name: ${emailData.stateHeadName}\r\n
        Amount Paid: ${emailData.amountPaid}\r\n
        Date Of Purchase: ${emailData.DateOfPurchase}\r\n</span>`,
        data: emailData,
      };
    }
    //return reportData;
    sendEmail({
      to: email.welcome.split(','),
      subject: reportData.emailSubject,
      body: reportData.emailBody,
    });
    return reportData;
    const { data, ...restData } = reportData;
    return data;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  alertSubscription,
};
