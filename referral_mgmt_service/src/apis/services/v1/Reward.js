const { Reward } = require("@root/src/apis/models/Reward");
const { RewardHistory } = require("@root/src/apis/models/RewardHistory");
const { HoldReward } = require("@root/src/apis/models/HoldReward");
const {
  REWARD_UPDATE_ERROR,
  REWARD_READ_ERROR,
} = require("@root/src/apis/errors");
const { RETAILER } = require("../../controllers/v1/Campaign");
const {Logger:log} = require('sarvm-utility')
const insert = async (data) => {
  log.info({info:'Reward service :: inside insert method'});
  
  const reward = await Reward(data).save();
  return reward;
};

const moveHoldRewardsUtil = async (retailerId) => {
  const filter = {
    retailerId: retailerId,
  };
  const batchSize = 500;
  await moveHoldRewards(HoldReward, Reward, filter, batchSize);
};

async function moveHoldRewards(
  sourceCollection,
  targetCollection,
  filter,
  batchSize
) {
  try {
    const fields = {
      userDetails: 1,
      refId: 1,
      referType: 1,
      isReferrer: 1,
      eventName: 1,
      eventType: 1,
      amount: 1,
    };
    sourceDocs = await sourceCollection
      .find(filter)
      .limit(batchSize)
      .select(fields);

    let docs = [];
    for (let i = 0; i < sourceDocs.length; i++) {
      // if the user is a retailer check for subscription
      if (sourceDocs[i].userDetails.userType == "RETAILER") {
        console.log("Hold rewards for retailer found");
        // get shopId for the retailer
        const retailer = await RMService.getShopDetails(
          sourceDocs[i].userDetails.userId
        );
        const shopId = retailer.shop_id;
        console.log("Shop id: ", shopId);
        //check if subscription bought
        const subs = await SubscriptionService.getSubscriptionbyShopId(shopId); //appName,shopId
        console.log(subs);
        if (subs) {
          docs[i] = sourceDocs[i];
        } else {
          console.log(
            "Subscription not bought. Setting the retailer id to self userId. Holding rewards further"
          );
          sourceCollection.findOneAndUpdate(
            {
              type: {
                $eq: "INDIVIDUAL",
              },
            },
            { $set: { retailerId: docs[i].userDetails.userId } },
            {
              new: true,
            }
          );
        }
      } else {
        docs[i] = sourceDocs[i];
      }
    }
    idsOfCopiedDocs = await insertBatch(targetCollection, docs);
    targetDocs = await targetCollection.find({
      _id: { $in: idsOfCopiedDocs },
    });
    await deleteBatch(sourceCollection, targetDocs);
    console.log("All Rewards Moved");
  } catch (err) {
    console.log(err);
  }
}
const insertToHoldRewards = async (data) => {
  const reward = await HoldReward(data).save();
  return reward;
};

const updateRewardStatus = async (rewardId, status) => {
  log.info({info:'Reward service :: inside update Reward Status'});
  const filter = { _id: rewardId };
  const options = { new: true };
  const update = { status: status };
  try {
    const updated = await Reward.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();
    if (updated == null) {
      throw new REWARD_UPDATE_ERROR();
    }
    return true;
  } catch (err) {
    return false;
  }
};

const getCashbackAmount = async (phone) => {
  log.info({info:'Reward service :: inside get cash back Amount'});
  try {
    let cashbackDocument = await Reward.find({
      eventType: "CASHBACK",
      "userDetails.phoneNumber": phone,
    }).exec();
    let cashbackAmount = 0;
    console.log("cashback document is", cashbackDocument)
    if (cashbackDocument.length == 1) {
      cashbackAmount = cashbackDocument[0].amount;
    } else if (cashbackDocument.length > 1) {
      for (let i = 0; i < cashbackDocument.length; i++) {
        cashbackAmount += cashbackDocument[i].amount;
      }
    }
    return cashbackAmount;
  } catch (err) {
    throw new REWARD_READ_ERROR();
  }
};

const isInsertionValid = async (refId, eventType, type, stage, userId) => {
  log.info({info:'Reward service :: inside is insertion valid'});
  let doc = await Reward.find({
    refId: refId,
    eventType: eventType,
    referType: type,
    eventName: stage,
    "userDetails.userId": userId,
    status: "pending",
  }).exec();
  if (doc.length > 0) {
    console.log("DUPLICATE REWARD DETECTED");
    return false;
  } else {
    return true;
  }
};

const isInsertionValidToHoldRewards = async (
  refId,
  eventType,
  type,
  stage,
  userId
) => {
  let doc = await HoldReward.find({
    refId: refId,
    eventType: eventType,
    referType: type,
    eventName: stage,
    "userDetails.userId": userId,
    status: "pending",
  }).exec();
  if (doc.length > 0) {
    console.log("DUPLICATE REWARD DETECTED");
    return false;
  } else {
    return true;
  }
};

const isCashbackValid = async (phone, eventType, stage) => {
  log.info({info:'Reward service :: inside Is Cash Back Valid'});
  let doc = await Reward.find({
    "userDetails.phoneNumber": phone,
    eventType: eventType,
    eventName: stage,
  }).exec();
  if (doc.length > 0) {
    console.log("DUPLICATE REWARD DETECTED");
    return false;
  } else {
    return true;
  }
};

const migrateSuccessfulSubscription = async () => {
  log.info({info: 'Reward service :: inside migration Successful Subscription'});
  const filter = {
    status: "success",
  };
  const batchSize = 500;
  await moveDocuments(Reward, RewardHistory, filter, batchSize);
};

async function moveDocuments(
  sourceCollection,
  targetCollection,
  filter,
  batchSize
) {
  try {
    // let count = await sourceCollection.find(filter).count();
    while ((count = await sourceCollection.find(filter).count()) > 0) {
      console.log(count + " documents remaining");
      sourceDocs = await sourceCollection.find(filter).limit(batchSize);
      idsOfCopiedDocs = await insertBatch(targetCollection, sourceDocs);

      targetDocs = await targetCollection.find({
        _id: { $in: idsOfCopiedDocs },
      });
      await deleteBatch(sourceCollection, targetDocs);
    }
    console.log("Done!");
  } catch (err) {
    console.log(err);
  }
}

async function insertBatch(collection, documents) {
  try {
    let insertedIds = [];
    let id;
    const count = documents.length;
    for (let i = 0; i < count; i++) {
      id = documents[i]._id;
      let bulkInsert = await collection.bulkWrite(
        [
          {
            insertOne: {
              document: documents[i],
            },
          },
        ],
        { new: false }
      );
      insertedIds.push(id);
    }
    console.log(count + " Rewards Moved");
    return insertedIds;
  } catch (err) {
    console.log(err);
  }
}

async function deleteBatch(collection, documents) {
  try {
    const count = documents.length;
    for (let i = 0; i < count; i++) {
      let bulkRemove = await collection.bulkWrite([
        {
          deleteOne: {
            filter: { _id: documents[i]._id },
          },
        },
      ]);
    }
    
  } catch (err) {
    
  }
}

module.exports = {
  insert,
  updateRewardStatus,
  getCashbackAmount,
  isInsertionValid,
  migrateSuccessfulSubscription,
  isCashbackValid,
  isInsertionValidToHoldRewards,
  insertToHoldRewards,
  moveHoldRewardsUtil,
};
