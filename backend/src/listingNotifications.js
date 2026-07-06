import { sendPushNotifications } from "./notifications.js";
import { prisma } from "./prisma.js";

export async function notifyUsersAboutNewListing(listing) {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: getNewListingRecipientFilter(listing),
    });

    await sendPushNotifications(
      tokens.map((token) => ({
        to: token.token,
        sound: "default",
        title: "New item listed",
        body: `${listing.sellerName || "Someone"} listed ${listing.title}.`,
        data: {
          listingId: listing.id,
          type: "new-listing",
        },
      }))
    );
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

    await sendPushNotifications(
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
  } catch (error) {
    console.error("Failed to send inquiry notification", error);
  }
}

function getNewListingRecipientFilter(listing) {
  const excludedSellers = [
    listing.sellerUserId ? { userId: listing.sellerUserId } : null,
    listing.sellerEmail ? { userEmail: listing.sellerEmail } : null,
  ].filter(Boolean);

  return excludedSellers.length ? { NOT: excludedSellers } : undefined;
}

function getSellerRecipientFilter(listing) {
  const recipients = [
    listing.sellerUserId ? { userId: listing.sellerUserId } : null,
    listing.sellerEmail ? { userEmail: listing.sellerEmail } : null,
  ].filter(Boolean);

  return recipients.length ? { OR: recipients } : null;
}
