const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1'
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const publish = ({ queueUrl, request, eventType }) => {
  const event = {
    MessageBody: JSON.stringify({ ...request, eventType }),
    QueueUrl: queueUrl,
  };
  return sqs.sendMessage(event).promise();
};

module.exports = { publish };
