import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();
// create SQS to send email
const sqs = new AWS.SQS();
export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  // update
  await dynamodb.update(params).promise();
  // send SQS
  const { title, seller, highestBid } = auction;
  const { amount, bidder } = highestBid;

  if(amount == 0 ){

    await sqs.sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "No bids on your auction item :( ",
        recipient: seller,
        body: `Oh NO! Your item "${title}" no bids, better luck next time`,
      }),
    }).promise();

    return;

  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Your item has been sold",
        recipient: seller,
        body: `Whoohoo! Your item "${title}" has been sold for $${amount}`,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "You wan an auctuion",
        recipient: bidder,
        body: `What a great deal you got yourself  a "${title}" for $${amount}`,
      }),
    })
    .promise();

  return Promise.all([notifyBidder,notifySeller]);

}
