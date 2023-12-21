const {
  aws: { queue_url: queueUrl },
} = require('@config');

const { publish } = require('@common/aws/producer');

const { Logger: log } = require('sarvm-utility');

const sendOtpMessage = async (request, eventType) => {
  try {
    const response = await publish({ queueUrl, request, eventType });
    log.info(`otp message sent to otp queue with Id: ${response.MessageId}`);
    return true;
  } catch (err) {
    log.error(err);
    log.error('error while sending message to otp queue ', err);
    return false;
  }
};

module.exports = { sendOtpMessage };
