const {
  aws: { queue_url: queueUrl },
} = require('@config');

const { publish } = require('@common/aws/producer');

const { Logger: log } = require('sarvm-utility');

const sendOtpMessage = async (request, eventType) => {
  log.info({info: 'Otp Producer :: sendOtpMessage'})
  try {
    const response =  publish({ queueUrl, request, eventType });
    // log.info('otp message sent to otp queue with Id: %s', response.MessageId);
    log.info({info: `Otp Producer :: Request for Otp Service inside queue with message id ${response.MessageId}`})
    
    return true;
  } catch (err) {
    // log.error('error while sending message to otp queue: %s', err.message);
    log.error({error: `Otp Producer :: Error while sending request via queue ${err}`})
    return false;
  }
};

module.exports = { sendOtpMessage };
