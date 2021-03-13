import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function updatePictureUrl(auction,pictureUrl) {

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set pictureUrl = :pictureUrl",
    ExpressionAttributeValues: {
      ":pictureUrl": pictureUrl,
    },
    ReturnValues: 'ALL_NEW',
    
  };

  // update
  const result = await dynamodb.update(params).promise();
  // Return updated record

  return result.Attributes;


}
