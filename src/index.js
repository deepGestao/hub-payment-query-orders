import { requestPendingItems } from './requestPendingItems/requestPendingItems';

const processPendingItems = async () => {
  let isDone = false;
  let lastEvaluatedStartKey;
  console.log('Initialize Loop');
  do {
    // eslint-disable-next-line no-await-in-loop
    const items = await requestPendingItems(lastEvaluatedStartKey);
    lastEvaluatedStartKey = items.lastEvaluatedStartKey;
    isDone = !(items.lastEvaluatedStartKey);
    console.log(`LastEvaluatedStartKey: ${lastEvaluatedStartKey}`);
    console.log(`Items: ${JSON.stringify(items.data)}`);
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
