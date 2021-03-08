import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
// Declare client 
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const { title } = JSON.parse(event.body)
  const now = new Date()
  // return auction
  const auction = {
    id: uuid(), // generate id 
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  }
  // insert to table 
  await dynamodb.put({
    // pass by env from serverless
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;


