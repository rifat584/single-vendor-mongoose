import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/ApiResponse.js";
import httpStatus from "http-status";
import { ProductService } from "./product.service.js";
import { AuthService } from "../auth/auth.service.js";

// Handle add product
const addProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.addProduct(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Successfully Added",
    data: result,
  });
});


// Handle show all products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProducts(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All products successfully retrieved",
    data: result,
  });
});


// Handle find single product
const getOneProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductService.getOneProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieve successful",
    data: result,
  });
});


// Handle update product
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = {
    id,
    data:req.body
  }
  const result = await ProductService.updateProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Successfully updated",
    data: result,
  });
});


// Handle delete product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string; //req.params in TS has type string or string []- so we use as string
  const result = await ProductService.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Successfully deleted",
  });
});


export const ProductController = {
  addProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
}
