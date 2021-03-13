// middleware
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";
import validator from "@middy/validator";
import uploadAuctionPictureSchema from "../lib/schemas/uploadAuctionPictureSchema";
import cors from "@middy/http-cors";
import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { updatePictureUrl } from "../lib/updatePictureUrl";
export async function uploadAuctionPicture(event) {
  // ID of the auction
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  // get info  about the user
  const { email } = event.requestContext.authorizer;
  // Validate auction ownership
  if (auction.seller != email) {
    throw new createError.Forbidden("You are not the seller of this auction");
  }

  // picture
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let updatedAuction = {};
  try {
    const pictureUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    updatedAuction = await updatePictureUrl(auction, pictureUrl);
    console.log(pictureUrl);
  } catch (error) {
    console.error(error);
    createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(
    validator({
      inputSchema: uploadAuctionPictureSchema,
    })
  )
  .use(cors());
