import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
// Middleware
import commonMiddleware from "../lib/commonMiddleware";
// validation
import validator from "@middy/validator";
import createAuctionsSchema from "../lib/schemas/createAuctionsSchema";

import createError from "http-errors";

// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  // dont need JSON parse since we are using middleware
  const { title } = event.body;
  // return auction
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
  };
  // insert to table

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}
// apply middleware
export const handler = commonMiddleware(createAuction).use(
  validator({ inputSchema: createAuctionsSchema })
);
// .use(httpJsonBodyParser()) // Parse string body
// .use(httpEventNormalizer()) // adjust gatway event object
// .use(httpErrorHandler()); // smothes error handling
