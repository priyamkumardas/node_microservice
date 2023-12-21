const {
    aws
  } = require('@config');
  
  const { publish } = require('@common/aws/producer');
  
  const { Logger: log } = require('sarvm-utility');
  let queueUrl = aws.queue.queue_url
  const sendSqsMessage = async (request, eventType) => {
    try {
      const response = await publish({ queueUrl, request, eventType });
      log.info(`sqs message sent to sqs queue with Id: ${response.MessageId}`);
      return true;
    } catch (err) {
      log.error(err);
      log.error('error while sending message to sqs queue ', err);
      return false;
    }
  };
  
  module.exports = { sendSqsMessage };
  