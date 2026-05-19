import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { ProductValidation } from "./product.validation.js";
import validateRequestData from "../../middleware/validateRequest.js";
import validateExistingProduct from "../../middleware/validateExistingProduct.js";
import validateAdmin from "../../middleware/validateAdmin.js";
import validateObjectIdParam from "../../middleware/validateObjectIdParam.js";

const router: Router = Router();

router.get("/", ProductController.getAllProducts);

router.get("/:id",
  validateObjectIdParam("id"),
  ProductController.getOneProduct);

router.put(
  "/:id",
  validateObjectIdParam("id"),
  validateRequestData(ProductValidation.ProductUpdateSchema),
  validateAdmin,
  validateExistingProduct,
  ProductController.updateProduct,
);

router.delete(
  "/:id",
  validateObjectIdParam("id"),
  validateRequestData(ProductValidation.ProductDeleteSchema),
  validateAdmin,
  validateExistingProduct,
  ProductController.deleteProduct,
);

router.post(
  "/add",
  validateRequestData(ProductValidation.ProductSchema),
  validateAdmin,
  ProductController.addProduct,
);

export const ProductRoutes = router;
