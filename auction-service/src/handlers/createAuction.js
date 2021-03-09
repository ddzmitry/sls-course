import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
// Middleware
import commonMiddleware from '../lib/commonMiddleware'

import createError from "http-errors";

// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();
const now = new Date();
const endDate = new Date();
endDate.setHours(now.getHours() + 1);

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body);
  const now = new Date();
  // return auction
  const auction = {
    id: uuid(), // generate id
    title,
    status: "OPEN",
    endingAt: endDate.toISOString(),
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    }
  };
  // insert to table

  try {
    await dynamodb
      .put({
        // pass by env from serverless
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.log(error)

    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };

}
// apply middleware
export const handler = commonMiddleware(createAuction)
  // .use(httpJsonBodyParser()) // Parse string body
  // .use(httpEventNormalizer()) // adjust gatway event object
  // .use(httpErrorHandler()); // smothes error handling
