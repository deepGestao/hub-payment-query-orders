import { SQS } from 'aws-sdk';

const sqs = new SQS();

const sendSqs = async (data) => {
  const res = await sqs.sendMessage({
    QueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT}/hub-payment-orders-to-process-${process.env.AWS_ENV}`,
    MessageBody: JSON.stringify(data),
  }).promise();
  console.log(res);
};

export { sendSqs };
