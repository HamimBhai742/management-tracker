import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import httpStatus from 'http-status'
import router from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import cookieParser from 'cookie-parser'


const app: Application = express();
app.use(cors({
  origin: ["https://project-management-tracker-three.vercel.app","http://16.171.132.158:3000","http://16.171.132.158:3000"] 
}))

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.send('Dxvid Music server is running.........');
});

app.use("/api/v1", router);
// app.use("/api/v1/webhook", express.raw({ type: "application/json" }), stripeWebhook);
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API ROUTE NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;