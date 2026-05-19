import { NextFunction, Request, Response } from "express";
import { Product } from "../modules/product/product.model.js";

const validateExistingProduct = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body;
    const id = req.params?.id as string;

    if (!userId) {
      throw new Error("User id is required!");
    }

    if (!id) {
      throw new Error("Product Id is required!");
    }

    const isProductExist = await Product.findOne({
      _id: id,
      adminId: userId,
    }).lean();

    if (!isProductExist) {
      throw new Error("Product doe not exist!");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateExistingProduct;
