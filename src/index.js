/* eslint-disable no-await-in-loop */
import { requestPendingItems } from './requestPendingItems/requestPendingItems';
import { sendSqs } from './sendSqs/sendSqs';

const processPendingItems = async () => {
  let isDone = false;
  let lastEvaluatedStartKey;
  console.log('Initialize Loop');
  do {
    const items = await requestPendingItems(lastEvaluatedStartKey);
    await sendSqs(items.data);
    lastEvaluatedStartKey = items.lastEvaluatedStartKey;
    isDone = !(items.lastEvaluatedStartKey);
    console.log(`LastEvaluatedStartKey: ${lastEvaluatedStartKey}`);
  } while (!isDone);
  console.log('End Loop');
};

const handler = async (event, context) => {
  console.log(event, context);
  try {
    await processPendingItems();
    return {
      statusCode: 200,
      body: '{}',
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'internal server error' }),
    };
  }
};

export { handler };
