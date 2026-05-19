import mongoose from "mongoose";
import { Order, OrderItem } from "./order.model.js";
import { Product } from "../product/product.model.js";
import { OrderType, userIdType } from "./order.validation";


const createNewOrder = async (payload: OrderType) => {
  const { userId, orderItems } = payload;

  // Find and merge products qty to avoid duplicates orders
const itemTotals = new Map<string, number>(); //creates an empty Map Obj

for (const item of orderItems) { //for each order item
  //gets items from itemTotals, first loop returns undefined as itemTotals is empty hence || 0
  const currentQuantity = itemTotals.get(item.productId) || 0;
  // set productId as keys and merged qty as values itemTotals
  itemTotals.set(item.productId, currentQuantity + item.quantity);
}

// Extract unique IDs to find products from DB
const uniqueProductIds = Array.from(itemTotals.keys());

  // Find products
  const orderedProducts = await Product.find({
    _id: { $in: uniqueProductIds },
  })
    .select("_id price stock")
    .lean();

  // Create the lookup map (O(N) + O(M) optimization)
  const productMap = new Map(
    orderedProducts.map((product) => [product._id.toString(), product])
  );

  let totalPrice = 0;

  // Validate stock and calculate total using the consolidated cart
  for (const item of itemTotals.entries()) {
    const [productId, orderedQty]= item;
    const product = productMap.get(productId);

    if (!product) throw new Error(`Product not found: ${productId}`);
    
    if (product.stock < orderedQty) {
      throw new Error(`Product ${productId} quantity exceeds stock`);
    }

    totalPrice += orderedQty * product.price;
  }

  // Run the Database Transaction
  const session = await mongoose.startSession();
  let order;

  try {
    session.startTransaction();

    const [orderCreate] = await Order.create(
      [
        {
          userId,
          totalAmount: totalPrice,
        },
      ],
      { session },
    );

    const orderItemsData = Array.from(itemTotals.entries()).map(
      ([productId, quantity]) => ({
        orderId: orderCreate._id,
        productId,
        quantity,
      }),
    );

    await OrderItem.insertMany(orderItemsData, { session });

    for (const [productId, quantity] of itemTotals.entries()) {
      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: -quantity } },
        { session },
      );
    }

    const orderItems = await OrderItem.find({ orderId: orderCreate._id })
      .session(session)
      .lean();

    await session.commitTransaction();
    order = {
      ...orderCreate.toObject(),
      orderItems,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return order;
};

const myOrders = async (payload: userIdType) => {
  const { userId } = payload;
  const result = await Order.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();
  return result;
};

// Handle Cancel Order
const cancelOrder = async (payload: string) => {
  const  orderId  = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "PENDING") {
      throw new Error(`Cannot cancel order. Current status is ${order.status}`);
    }

    const orderItems = await OrderItem.find({ orderId: order._id })
      .session(session)
      .lean();

    if (orderItems.length === 0) {
      throw new Error("No items found connected to this order.");
    }

    order.status = "CANCELLED";
    await order.save({ session });

    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: item.quantity } },
        { session },
      );
    }

    await session.commitTransaction();
    return order.toObject();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const OrderService = {
  createNewOrder,
  myOrders,
  cancelOrder,
};
