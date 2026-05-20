import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import validateRequestData from "../../middleware/validateRequest.js";
import { AuthValidation } from "./auth.validation.js";
import { upload } from "../../middleware/multer.middleware.js";

const router: Router = Router();

// Handles -> Endpoint creation, connecting routes to controller

router.post(
  "/login",
  validateRequestData(AuthValidation.loginSchema),
  AuthController.login,
);

router.post(
  "/register",
  validateRequestData(AuthValidation.registerSchema),
  AuthController.register,
);

router.post(
  "/verify-email",
  validateRequestData(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail,
);

router.get("/change-password", AuthController.changePassword);
router.get("/forgot-password", AuthController.forgotPassword);

router.post('/multer',upload.single("image"), AuthController.multer)


export const AuthRoutes = router;
