import AWS from "aws-sdk";
// Middleware
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";
import { getAuctionById } from "./getAuction";
// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

import validator from "@middy/validator";
import createBidSchema from "../lib/schemas/createBidSchema";

async function placeBid(event, context) {
  //   console.log(event);
  const { id } = event.pathParameters;
  // we use validator no Json parse needed 
  const { amount } = event.body;
  // get info  about the user 
  const { email } = event.requestContext.authorizer;

  const auction = await getAuctionById(id);
  // Bid Identity
  if(email == auction.seller){
    throw new createError.Forbidden(`You can't bid on your own aucitons`);
  }
  // Double bitting
  // if(email == auction.bidder){
  //   throw new createError.Forbidden(`You are already the highest bidder`);
  // }

  // Auctuion status validation
  if (auction.status !== "OPEN") {
    throw new createError.Forbidden(`You can't bid on CLOSED auciton`);
  }
  // Validate the ammount 
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount} `
    );
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount, highestBid.bidder = :bidder",
    // update value by passing values
    ExpressionAttributeValues: {
      ":amount": amount,
      ":bidder":email,
    },
    ReturnValues: "ALL_NEW",
  };

  //   console.log(params)

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();

    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}
// apply middleware
export const handler = commonMiddleware(placeBid).use(validator({ inputSchema: createBidSchema }));