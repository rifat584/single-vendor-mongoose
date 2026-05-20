import mongoose from "mongoose";
import { ORDER_STATUS } from "../../../utils/enum.js";
const { model, models, Schema } = mongoose;

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ORDER_STATUS,
      default: "PENDING",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);


const orderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const Order =
  models.Order || model("Order", orderSchema);

export const OrderItem =
  models.OrderItem || model("OrderItem", orderItemSchema);
