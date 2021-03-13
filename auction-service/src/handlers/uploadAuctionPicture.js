// middleware
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

import { getAuctionById } from "./getAuction";
import { uploadPictureToS3 } from "../lib/uploadPictureToS3";
import { updatePictureUrl } from "../lib/updatePictureUrl";
export async function uploadAuctionPicture(event) {
  // ID of the auction
  const { id } = event.pathParameters;

  const auction = await getAuctionById(id);
  // picture
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  try {
    const pictureUrl = await uploadPictureToS3(auction.id + ".jpg", buffer);
    await updatePictureUrl(auction, pictureUrl);
    console.log(pictureUrl);
  } catch (error) {
    console.error(error);
    createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler());
