import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes/routes";
import notFound from "./app/middleware/notFound";
import globalError from "./app/middleware/globalError";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  console.log("app is running...");
  res.json({
    message: "Successful",
  });
});

// Listen and create the base path & call router
const path: string = "/api/v1";
app.use(path, router);

// Returns 404 for any invalid routes
app.use(globalError);
app.use(notFound);

export default app;
