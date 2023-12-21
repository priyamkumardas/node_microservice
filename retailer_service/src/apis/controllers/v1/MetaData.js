/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const ShopService = require('@services/v1/Shop');

const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');
const ShopMetaDataService = require('@services/v1/ShopMetaData');
const { masterCatalog } = require('../../services/v1/cms');

const metaData = async (shop_id) => {
  log.info({ info: 'Retailer Controller :: Inside meta data' });
  // console.log(shop_id)
  const masterCatalogs = await masterCatalog();
  // console.log("master catalog"+masterCatalogs)
  const respose = {};
  respose.helpVideos = {
    Onboarding: 'https://www.youtube.com/embed/XWs9D8GdmoQ',
    Order: 'https://www.youtube.com/embed/xUEI6UTvrcQ',
    Referral: 'https://www.youtube.com/embed/5er14mGo4_E',
    Catalog: 'https://www.youtube.com/embed/UquPoXwilWk',
  };
  respose.appVersions = {
    household: {
      ios: {
        min: '0.0.0',
        max: '10.1.1',
        updateUrl: 'https://link.to.apple.app.store/',
      },
      android: {
        min: '0.1.75',
        max: '10.1.1',
        updateUrl: 'https://play.google.com/store/apps/details?id=com.sarvm.hh',
      },
    },
    retailer: {
      ios: {
        min: '0.0.0',
        max: '10.1.0',
        updateUrl: 'https://link.to.apple.app.store/',
      },
      android: {
        min: '0.1.68',
        max: '10.1.1',
        updateUrl: 'https://play.google.com/store/apps/details?id=com.sarvm.biz',
      },
    },
    logistics: {
      ios: {
        min: '0.0.0',
        max: '10.1.0',
        updateUrl: '',
      },
      android: {
        min: '0.0.0',
        max: '10.1.1',
        updateUrl: '',
      },
    },
  };
  respose.language_meta = [
    {
      version: 21,
      id: 2,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Hindi_v21.json',
      displayText: 'हिन्दी',
      text: 'Hindi',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 1,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/English_v21.json',
      displayText: 'English',
      text: 'English',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 3,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Assamese_v21.json',
      displayText: 'অসমীয়া',
      text: 'Assamese',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 4,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Malayalam_v21.json',
      displayText: 'മലയാളം',
      text: 'Malayalam',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 5,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Odia_v21.json',
      displayText: 'ଓଡ଼ିଆ',
      text: 'Odia',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 6,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Telugu_v21.json',
      displayText: 'తెలుగు',
      text: 'Telugu',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 7,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Bangala_v21.json',
      displayText: 'বাংলা',
      text: 'Bangala',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 8,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Gujarati_v21.json',
      displayText: 'ગુજરાતી',
      text: 'Gujarati',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 9,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Kannada_v21.json',
      displayText: 'ಕನ್ನಡ',
      text: 'Kannada',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 10,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Marathi_v21.json',
      displayText: 'मराठी',
      text: 'Marathi',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 11,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Tamil_v21.json',
      displayText: 'தமிழ்',
      text: 'Tamil',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
    {
      version: 21,
      id: 12,
      url: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/test_data/languages/Punjabi_v21.json',
      displayText: 'ਪੰਜਾਬੀ',
      text: 'Punjabi',
      image: 'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/dummy.svg',
    },
  ];
  respose.catalogue_meta = {
    categories: {
      version: 31,
      url: 'https://uat-static.sarvm.ai/test_data/category_data/cat_v31.json',
    },
    products: {
      version: 31,
      url: 'https://uat-static.sarvm.ai/test_data/category_data/prod_v31.json',
    },
    microCategpries: {
      version: 31,
      url: 'https://uat-static.sarvm.ai/test_data/category_data/micro_v31.json',
    },
    masterCatalog: masterCatalogs,
  };
  try {
    const result = await ShopService.showShopDetailsByShopId(shop_id);
    const resultFromMetaData = await ShopMetaDataService.getMetaData(shop_id);
    if (result.length > 0) {
      const {
        shop_id,
        user_id,
        shop_name,
        longitude,
        latitude,
        shop_number,
        locality,
        landmark,
        city,
        street,
        veg,
        delivery,
        image,
        type_of_retailer,
        GST_no,
        isSubscribed,
        isKYCVerified,
        selling_type,
        pincode,
      } = result[0];
      respose.shop = {
        shop_id,
        user_id,
        shop_name,
        longitude,
        latitude,
        shop_number,
        locality,
        landmark,
        city,
        street,
        image,
        pincode,
        resultFromMetaData,
      };
      let isSub = false;
      let isKyc = false;
      if (isKYCVerified !== null) {
        isKyc = isKYCVerified;
      }
      if (isSubscribed !== null) {
        isSub = isSubscribed;
      }
      let onb = false;
      if (isKYCVerified && isSubscribed) {
        onb = true;
      }
      let gst_no = false;
      if (GST_no !== null) {
        gst_no = true;
      }
      respose.flag = {
        onBoarding: onb,
        isSubscribed: isSub,
        GST_no: gst_no,
        isKYCVerified: isKyc,
      };
    } else {
      respose.flag = {
        onBoarding: false,
        isSubscribed: false,
        GST_no: null,
        isKYCVerified: false,
      };
    }
  } catch (err) {
    log.error({ error: err });
    respose.shop = null;
    respose.flag = {
      onBoarding: false,
      isSubscribed: false,
      GST_no: false,
      isKYCVerified: false,
    };
  }
  return respose;
};

module.exports = {
  metaData,
};
