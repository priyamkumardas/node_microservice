const AWS = require('aws-sdk');
const { Consumer: AWSConsumer } = require('sqs-consumer');

AWS.config.update({
  region: 'ap-south-1',
});

class Consumer {
  static create({ queueUrl, messageHandler }) {
    return AWSConsumer.create({
      queueUrl,
      handleMessage: messageHandler,
      sqs: new AWS.SQS(),
    });
  }
}

module.exports = {
  Consumer,
};
