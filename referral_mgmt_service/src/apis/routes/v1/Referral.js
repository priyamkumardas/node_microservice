const express = require("express");

// Todo: User some module-alias
const { HttpResponseHandler , Logger:log} = require("sarvm-utility");
const { ReferralsController } = require("@controllers/v1");
const { system_token } = require("@config");

const Schemas = require("@root/src/common/libs/Validation/Schemas");
const { validate } = require("@root/src/common/libs/Validation/Validation");
const router = express.Router();

// Todo: Follow camelcasing
router.post(
  "/invite",
  validate({ body: Schemas.inviteSchema }),
  async (req, res, next) => {
    log.info({info:'Refferal routes: inside referal invite'});
    try {
      const { authPayload: user } = req;
      const token = `systemToken ${system_token}`;
      const {
        userId: refBy,
        userType: refByUserType,
        phone: refByPhone,
        flyyUserId: refByFlyyUserId,
        segmentId: refBySegmentId,
      } = user;
      const phone = req.body.phone;
      const type = req.body.type;
      const latitude = req.headers.lat
      const longitude = req.headers.lon
      const location = {longitude, latitude}
      const data = await ReferralsController.invite({
        refBy,
        refByPhone,
        refByUserType,
        refByFlyyUserId,
        refBySegmentId,
        phone,
        type,
        token,
        location
      });
      HttpResponseHandler.success(req, res);
    } catch (error) {
      log.error({error: error});
      next(error);
    }
  }
);

router.post("/generateReferralCode", async (req, res, next) => {
  //Done
  log.info({info:'Refferal Route :: inside generated referral code'});
  try {
    const { authPayload: user } = req;
    console.log(user);
    const id = req.body.id;
    const userName = req.body.userName;
    const data = await ReferralsController.generateReferralCode(id, userName);
    console.log(data);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error});
    next(error);
  }
});

router.post(
  "/sendReminder",
  validate({ body: Schemas.inviteSchema }),
  async (req, res, next) => {
log.info({info:'Refferal route :: inside send reminder'});
    try {
      const { authPayload: user } = req;
      const refBy = user.userId;
      const type = req.body.type;
      const phone = req.body.phone;
      const data = await ReferralsController.sendReminder(refBy, type, phone);
      HttpResponseHandler.success(req, res);
    } catch (error) {
      log.error({error:error});
      next(error);
    }
  }
);

router.get("/", async (req, res, next) => {
   
  log.info({info: 'Refferal route :: inside get refferal'});
  try {
    const { authPayload: user, headers } = req;

    const { app_name } = headers;
    // console.log(user, app_name);
    const refBy = user.userId;
    const refByPhone = user.phone;

    const data = await ReferralsController.referral(
      refBy,
      refByPhone,
      app_name
    );
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.put("/ratings", async (req, res, next) => {
  log.info({info: 'Refferal route :: inside update rating'});
  try {
    const { phone_number, ratings, comments, type } = req.body;
    const data = { phone_number, ratings, comments, type };
    const result = await ReferralsController.updateRatings(data);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error:error});
    next(error);
  }
});

router.put("/", validate({ body: Schemas.phone }), async (req, res, next) => {
  log.info({info: 'Refferal route :: inside put Refferal API'});
  try {
    const { authPayload: user } = req;
    const type = req.body.userType;
    const phone = req.body.phone;
    const segmentId = req.body.segmentId;
    const flyyUserId = req.body.flyyUserId;
    const userId = req.body.userId;
    // const ref_by = user.userId;
    const stage = req.body.stage;
    console.log("inside on status update")
    console.log(type, phone, userId, stage, segmentId, flyyUserId);

    const data = await ReferralsController.onStatusUpdate(
      userId,
      type,
      phone,
      stage,
      segmentId,
      flyyUserId
    );
    HttpResponseHandler.success(req, res);
  } catch (error) {
    log.error({error:error});
    console.log(error);
    next(error);
  }
});

router.patch("/on-expired", async (req, res, next) => {
  log.info({info:'Refferal route :: inside on expired'});
  try {
    const { authPayload: user } = req;
    const data = await ReferralsController.onReferralExpired();
    HttpResponseHandler.success(req, res);
  } catch (error) {
    log.error({error:error});
    next(error);
  }
});
// transfer Routes
router.patch("/transfer", async (req, res, next) => {
  log.info({info:'Refeeral route :: inside transfer Api'});
  try {
    const { authPayload: user } = req;
    const body = req.body;
    const { userId, ref_by, refByPhone, refByUserType, refByFlyyUserId, refBySegmentId } = body;
    const data = await ReferralsController.updateTransfer(
      userId,
      ref_by,
      refByPhone,
      refByUserType,
      refByFlyyUserId,
      refBySegmentId
    );
    HttpResponseHandler.success(req, res);
  } catch (error) {
    console.log(error);
    log.error({error: error});
    next(error);
  }
});

router.get('/referee/:phone', async (req, res, next) => {
  log.info({info:'Referral route :: inside referee phone'});
  try {
    const { phone } = req.params
    const data = await ReferralsController.referreDetails(phone);
    HttpResponseHandler.success(req, res, data);
  } catch(error) {
    log.error({error:error});
    next(error)
  }
})

router.put("/order", async (req, res, next) => {
  log.info({info : 'Refferal route :: inside put order'});
  try {
    const { authPayload: user } = req;
    const body = req.body;
    const { retailerPhone, customerPhone, amount, order_id, logisticsPhone } = body;

    console.log("data is", retailerPhone, customerPhone, amount, order_id, logisticsPhone);

    const data = await ReferralsController.onOrderComplete(
      retailerPhone,
      customerPhone,
      amount,
      order_id,
      logisticsPhone
    );
    HttpResponseHandler.success(req, res);
  } catch (error) {
    console.log(error);
    log.error({error:error});
    next(error);
  }
});

module.exports = router;

// router.put(
//   "/on_acknowledgement",
//   validate({ body: Schemas.inviteSchema }),
//   async (req, res, next) => {
//     try {
//       const { authPayload: user } = req;
//       const type = req.body.type;
//       const phone = req.body.phone;
//       const data = await ReferralsController.onAcknowledgement(type, phone);
//       HttpResponseHandler.success(req, res);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.put(
//   "/on_signup",
//   validate({ body: Schemas.inviteSchema }),
//   async (req, res, next) => {
//     try {
//       const { authPayload: user } = req;
//       const type = req.body.type;
//       const phone = req.body.phone;
//       const data = await ReferralsController.onSignup(type, phone);
//       HttpResponseHandler.success(req, res);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.put(
//   "/on_profile_completion",
//   validate({ body: Schemas.inviteSchema }),
//   async (req, res, next) => {
//     try {
//       const { authPayload: user } = req;
//       const type = req.body.type;
//       const phone = req.body.phone;
//       const data = await ReferralsController.onProfileCompletion(type, phone);
//       HttpResponseHandler.success(req, res);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.put(
//   "/on_first_order",
//   validate({ body: Schemas.inviteSchema }),
//   async (req, res, next) => {
//     try {
//       const { authPayload: user } = req;
//       const type = req.body.type;
//       const phone = req.body.phone;
//       const data = await ReferralsController.onFirstOrder(type, phone);
//       HttpResponseHandler.success(req, res);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.put(
//   "/on_reward_recieved",
//   validate({ body: Schemas.inviteSchema }),
//   async (req, res, next) => {
//     try {
//       const { authPayload: user } = req;
//       const ref_by = user.phone;
//       const type = req.body.type;
//       const phone = req.body.phone;
//       const data = await RewardsController.onRewardRecieved(ref_by,type,phone);
//       HttpResponseHandler.success(req, res);
//     } catch (error) {
//       next(error);
//     }
//   }
// );
