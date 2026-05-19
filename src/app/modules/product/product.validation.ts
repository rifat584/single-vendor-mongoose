import { z } from "zod";
import { isValidObjectId } from "../../../utils/objectId.js";

const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Invalid Mongo ObjectId",
});

// Add Product Schema
export const ProductSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  userId: objectIdSchema,
  description: z
    .string()
    .min(20, "Product description should be minimum 20 characters"),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

// Update product Schema
export const ProductUpdateSchema = z
  .object({
    userId: objectIdSchema,
    title: z.string().min(4, "Title must be at least 4 characters").optional(),
    price: z.number().positive("Price must be greater than 0").optional(),
    stock: z.number().int().nonnegative("Stock cannot be negative").optional(),
    description: z.string().min(20, "Product description should be minimum 20 characters").optional(),
  })
  .refine(
    (bodyData) => {
      const { userId, ...updateFields } = bodyData; //separate adminId and other fields
      return Object.keys(updateFields).length > 0; //Make sure at least 1 field has been updated
    },
    {
      message: "At least one product field must be provided to update",
    }
  );

export type ProductUpdateSchemaType = z.infer<typeof ProductUpdateSchema>;

export const ProductDeleteSchema = z.object({
  userId: objectIdSchema,
});

export const ProductValidation = {
  ProductSchema,
  ProductUpdateSchema,
  ProductDeleteSchema,
};
