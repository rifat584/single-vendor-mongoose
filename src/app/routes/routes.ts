import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { ProductRoutes } from "../modules/product/product.route.js";
import { OrderRoutes } from "../modules/order/order.routes.js";

const router: Router = Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
