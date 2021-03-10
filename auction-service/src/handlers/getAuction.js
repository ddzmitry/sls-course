import AWS from "aws-sdk";
// Middleware
import commonMiddleware from "../lib/commonMiddleware";
import createError from "http-errors";

// Declare client
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;
  try {
    // console.log(event);

    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    };
    // get by id
    const result = await dynamodb.get(params).promise();

    auction = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }
  if (!auction) {
    throw new createError.NotFound(`Auction ID "${id}" not found!`);
  }

  return auction;

}

async function getAuction(event, context) {
  // query by id
  const { id } = event.pathParameters;
  let auction = await getAuctionById(id)
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}
// apply middleware
export const handler = commonMiddleware(getAuction)
// add validation layer

// .use(httpJsonBodyParser()) // Parse string body
// .use(httpEventNormalizer()) // adjust gatway event object
// .use(httpErrorHandler()); // smothes error handling
