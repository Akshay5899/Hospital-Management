import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();
config();

const allowedOrigins = [
  process.env.FRONTEND_URL_ONE,
  process.env.FRONTEND_URL_TWO,
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.toLowerCase();
  if (allowedOrigins.some((allowed) => allowed && normalizedOrigin === allowed.toLowerCase())) {
    return true;
  }

  return (
    normalizedOrigin.includes("localhost") ||
    normalizedOrigin.includes("127.0.0.1") ||
    normalizedOrigin.endsWith(".vercel.app") ||
    normalizedOrigin.endsWith(".netlify.app") ||
    normalizedOrigin.includes("onrender.com") ||
    normalizedOrigin.includes("render.com")
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
