import User from "@/models/User";
import Order from "@/models/Order";
import ShipRocketToken from "@/models/ShipRocketToken";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import dbConnect from "@/lib/db/connection";

async function fetchFirstDocuments(
  retryDelay = 2000,
  maxRetries = 6,
  attempt = 1
) {
  if (attempt > maxRetries) {
    console.error("Max retries reached. Stopping execution.");
    return;
  }

  await dbConnect();

  try {
    console.log("Executed");

    const firstUser = await User.findOne().sort({ _id: 1 }).exec();
    const firstOrder = await Order.findOne().sort({ _id: 1 }).exec();
    const firstShipRocketToken = await ShipRocketToken.findOne()
      .sort({ _id: 1 })
      .exec();
    const firstSessionStartedOrder = await SessionStartedOrder.findOne()
      .sort({ _id: 1 })
      .exec();

    if (
      firstUser ||
      firstOrder ||
      firstShipRocketToken ||
      firstSessionStartedOrder
    ) {
      console.log("Fetched first documents:", {
        firstUser,
        firstOrder,
        firstSessionStartedOrder,
      });
    } else {
      console.log("No documents found. Stopping execution.");
    }
  } catch (error) {
    console.error(
      `Error fetching first documents (Attempt ${attempt}/${maxRetries}):`,
      error.message
    );
    setTimeout(
      () => fetchFirstDocuments(retryDelay, maxRetries, attempt + 1),
      retryDelay
    );
  }
}

export default fetchFirstDocuments;
