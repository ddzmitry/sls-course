import AWS from "aws-sdk";
// Middleware
import commonMiddleware from '../lib/commonMiddleware'
import createError from "http-errors";
import validator from '@middy/validator';
import getAuctionsSchema from '../lib/schemas/getAuctionsSchema'
// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  // get status 
  const { status } = event.queryStringParameters;

  let auctions;
  // Scan synamodb to get records
  try {

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        // Make sure to specify index when query
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
          ':status': status,
        },
        ExpressionAttributeNames: {
          '#status': 'status',
        },
    };
    const result = await dynamodb.query(params).promise();
    auctions = result.Items;


  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}
// apply middleware
export const handler = commonMiddleware(getAuctions).use(validator(
  {
    inputSchema: getAuctionsSchema,
    useDefaults: true
  }
));
