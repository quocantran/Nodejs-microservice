"use strict";

import dayjs from "dayjs";
import { getClients } from "../dbs/init.elasticsearch";

const elasticLogger = async (err: any, statusCode: number = null) => {
  const elasticClient = getClients();
  const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const logMessage = {
    timestamp: time,
    stack: err.stack,
    name: err.name || "Error",
    message: err.message || "Internal Server Error",
    code: statusCode || 500,
  };

  try {
    await elasticClient.instanceConnect.index({
      index: "server-logs",
      body: logMessage,
    });
  } catch (err) {
    console.log(err);
  }
};

export default elasticLogger;
