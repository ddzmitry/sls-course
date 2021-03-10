import { getEndedAuctions } from "../lib/getEndedAuctions";
import { closeAuction } from "../lib/closeAuction";
import createError from "http-errors";

async function processAuctions(event, context) {
  // get all auctions to close
  try {
    const auctionsToClose = await getEndedAuctions();
    // close in parallel
    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction)
    );
    // Promisse all 
    await Promise.all(closePromises);
    return { closed: closePromises.length };

  } catch (error) {

     console.error(error);
     throw new createError.InternalServerError(error)
  }
}

export const handler = processAuctions;
