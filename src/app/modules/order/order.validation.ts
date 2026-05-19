import { z } from "zod";
import { isValidObjectId } from "../../../utils/objectId.js";

const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid Mongo ObjectId",
});

const OrderItemsSchema = z.object({
  productId: objectIdSchema,
  quantity: z.number().int().positive({ message: "Quantity must be at least 1" }),
});
export type OrderItemsType = z.infer<typeof OrderItemsSchema>;

const OrderSchema = z.object({
  userId: objectIdSchema,
  orderItems: z.array(OrderItemsSchema).min(1, { message: "Cart cannot be empty" }),
});

export type OrderType = z.infer<typeof OrderSchema>;

// User ID Schema
export const userIdSchema = z.object({
  userId: objectIdSchema,
});
export type userIdType = z.infer<typeof userIdSchema>;

export const OrderValidation = {
  OrderSchema,
  userIdSchema,
  OrderItemsSchema,
};
