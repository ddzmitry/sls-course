import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();
  // Params ti query dynamodb
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    // Query
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    // Params
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    // Attributes
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const result = await dynamodb.query(params).promise();
  // Return items
  return result.Items;
}
