import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import instanceMongodb from "./dbs/init.mongodb";
import dotenv from "dotenv";
import router from "./routes";

const app = express();

//config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
dotenv.config();

//connect to database
instanceMongodb;

//config routes
app.use("/", router);

//config error handler
class HttpError extends Error {
  status?: number;
}

app.use((req: Request, res: Response) => {
  const error = new HttpError("Not found");
  error.status = 404;
  throw error;
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    code: statusCode,
  });
});

export default app;
