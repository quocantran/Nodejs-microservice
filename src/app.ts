import express, { Request, Response } from "express";
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

export default app;
