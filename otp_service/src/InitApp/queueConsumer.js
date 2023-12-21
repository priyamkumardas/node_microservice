const Config = require('@config');
const { Consumer } = require('@common/aws/Consumer');
const { handleOTPConsumerReq } = require('@consumers/OTPConsumer.js');
const { Logger: log } = require('sarvm-utility');

const consumer = Consumer.create({ queueUrl: Config.aws.queue_url, messageHandler: handleOTPConsumerReq });

consumer.on('error', (err) => {
  log.error(err.message);
});

consumer.on('processing_error', (err) => {
  log.error(err.message);
});

module.exports = {
  consumer,
};
