import { Router } from "express";
import { OrderController } from "./order.controller.js";
import { OrderValidation } from "./order.validation.js";
import validateRequestData from "../../middleware/validateRequest.js";
import validateObjectIdParam from "../../middleware/validateObjectIdParam.js";

const router: Router = Router();

router.post(
  "/",
  validateRequestData(OrderValidation.OrderSchema),
  OrderController.createNewOrder,
);

router.get(
  "/my-order/:userId",
  validateObjectIdParam("userId"),
  OrderController.myOrders,
);

router.delete(
  "/:id/cancel",
  validateObjectIdParam("id"),
  OrderController.cancelOrder,
);

export const OrderRoutes = router;
