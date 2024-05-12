import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import instanceMongodb from "./dbs/init.mongodb";
import dotenv from "dotenv";

const app = express();

//config middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
dotenv.config();

//connect to database
instanceMongodb;

//config routes

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World",
  });
});

export default app;
