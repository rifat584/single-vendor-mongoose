import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync.js";
import { OrderService } from "./order.service.js";
import sendResponse from "../../../utils/ApiResponse.js";
import httpStatus from "http-status";

// Handle Create Order
const createNewOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createNewOrder(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order successfully placed",
    data: result,
  });
});
// Handle My Orders
const myOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.myOrders({
    userId: req.params.userId as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listed all orders",
    data: result,
  });
});

// Handle Create Order
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await OrderService.cancelOrder(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order canceled!",
    data: result,
  });
});

export const OrderController = {
  createNewOrder,
  myOrders,
  cancelOrder,
};
