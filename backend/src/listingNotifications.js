import { sendPushNotifications } from "./notifications.js";
import { prisma } from "./prisma.js";

export async function notifyUsersAboutNewListing(listing) {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: getNewListingRecipientFilter(listing),
    });

    const result = await sendPushNotifications(
      tokens.map((token) => ({
        to: token.token,
        sound: "default",
        title: "New item listed",
        body: `${listing.sellerName || "A seller"} listed ${listing.title}.`,
        data: {
          listingId: listing.id,
          type: "new-listing",
        },
      }))
    );
    await removeInvalidPushTokens(result.invalidTokens);
  } catch (error) {
    console.error("Failed to send new listing notifications", error);
  }
}

export async function notifySellerAboutInquiry({ buyer, inquiry, listing }) {
  try {
    const recipientFilter = getSellerRecipientFilter(listing);
    if (!recipientFilter) return;

    const tokens = await prisma.pushToken.findMany({
      where: recipientFilter,
    });

    const result = await sendPushNotifications(
      tokens.map((token) => ({
        to: token.token,
        sound: "default",
        title: "Buyer inquiry",
        body: `${buyer?.name || buyer?.email || "Someone"} asked about ${
          listing.title
        }.`,
        data: {
          inquiryId: inquiry.id,
          listingId: listing.id,
          type: "listing-inquiry",
        },
      }))
    );
    await removeInvalidPushTokens(result.invalidTokens);
  } catch (error) {
    console.error("Failed to send inquiry notification", error);
  }
}

function getNewListingRecipientFilter(listing) {
  return listing.sellerUserId ? { NOT: { userId: listing.sellerUserId } } : undefined;
}

function getSellerRecipientFilter(listing) {
  return listing.sellerUserId ? { userId: listing.sellerUserId } : null;
}

async function removeInvalidPushTokens(tokens) {
  if (!tokens.length) return;
  await prisma.pushToken.deleteMany({ where: { token: { in: tokens } } });
}
