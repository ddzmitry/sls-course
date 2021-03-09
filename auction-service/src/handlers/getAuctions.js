import AWS from "aws-sdk";
// Middleware
import commonMiddleware from '../lib/commonMiddleware'
import createError from "http-errors";

// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions;
  // Scan synamodb to get records
  try {

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
    };
    const result = await dynamodb.scan(params).promise();
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
export const handler = commonMiddleware(getAuctions)
