const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger:log
} = require('sarvm-utility');
const { Favourite } = require('@root/src/apis/models');
const { DATA_BASE_ERROR } = require('../../../common/libs/ErrorHandler');
const getAllFavourites = async (userId) => {
  log.info({info: 'Favourite Service :: inside get all favourite' })
  try {
    const result = await Favourite.find({ userId });
    if(result == null) {
      log.warn({warn:'result is null'});
    }
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while getAllFavourite by userId in DB');
  }
};

const getFavourite = async (userId, id) => {
  log.info({info: 'Favourite One Service :: inside get Favourite'});
  try {
    const result = await Favourite.findOne({
      userId: userId,
      _id: id,
    });
    if(result == null) {
      log.warn({warn:'result is null'});
    }
    //log.info({info:result})
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while getting Favourite in DB');
  }
};
const addFavourite = async (userId, data) => {
  log.info({info: 'Adding Favourite Service :: inside add favourite service'})
  try {
    const request = { userId, ...data };
    // console.log("this is userid",userId);
    const result = await Favourite.exists({shopId:data.shopId,userId:userId});
    // console.log("result",result);
    if(result) {
      // console.log(data.shopId)
      const result = await Favourite.deleteOne({ userId: userId, shopId:data.shopId }, { safe: true });
    return result;
    }
    return await new Favourite(request).save({ isNew: true });
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while adding Favourite in DB');
  }
};
const updateFavourite = async (userId, id, data) => {
  log.info({info : 'update Favourite Service :: inside update service'})
  try {
    const result = await Favourite.findOneAndUpdate(
      {
        userId: userId,
        _id: id,
      },
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    );
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while updating Favourite in DB');
  }
};
const deleteFavourite = async (userId, id) => {
  log.info({info: 'Delete Favourite Service :: inside Delete Service'})
  try {
    const result = await Favourite.deleteOne({ userId: userId, _id: id }, { safe: true });
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while delete Favourite in DB');
  }
};

module.exports = {
  getAllFavourites,
  getFavourite,
  addFavourite,
  updateFavourite,
  deleteFavourite,
};
