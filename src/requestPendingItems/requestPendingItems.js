import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB();

const getInitPoint = (lastEvaluatedStartKey) => {
  let result;
  if (lastEvaluatedStartKey) {
    result = {
      token: { S: 'pending' },
      when: { S: lastEvaluatedStartKey },
    };
  }
  return result;
};

const requestPendingItems = async (lastEvaluatedStartKey) => {
  const result = [];
  let lastKey = '';
  const response = await dynamodb.query({
    TableName: `hub-payment-scheduler-queue-${process.env.AWS_ENV}`,
    KeyConditionExpression: '#token = :token',
    FilterExpression: '#dateToProcess <= :currentDate',
    ExpressionAttributeNames: {
      '#token': 'token',
      '#dateToProcess': 'dateToProcess',
    },
    ExpressionAttributeValues: {
      ':token': { S: 'pending' },
      ':currentDate': { S: new Date().toISOString() },
    },
    Limit: 100,
    ExclusiveStartKey: getInitPoint(lastEvaluatedStartKey),
  }).promise();
  if (response.Items && response.Items.length > 0) {
    response.Items.forEach((item) => {
      result.push(DynamoDB.Converter.unmarshall(item));
    });
    lastKey = response.LastEvaluatedKey ? response.LastEvaluatedKey.when.S : '';
  }
  return {
    data: result,
    lastEvaluatedStartKey: lastKey,
  };
};

export { requestPendingItems };
