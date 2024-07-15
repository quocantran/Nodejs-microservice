"use strict";

import winston, { createLogger, level } from "winston";

import "winston-daily-rotate-file";

const { combine, timestamp, printf, json, align } = winston.format;

class WinstonLogger {
  private logger: winston.Logger;
  constructor() {
    const formatPrint = printf(
      ({ level, message, context, timestamp, requestId, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${
          metadata ? JSON.stringify(metadata) : ""
        }`;
      }
    );

    this.logger = createLogger({
      format: combine(
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          dirname: "/src/logs",
          level: "info",
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          // save log files in gzip format
          zippedArchive: true,
          // when file size is greater than 20mb, it will create a new file
          maxSize: "1m",
          // when file is older than 14 days, it will create a new file
          maxFiles: "14d",
          format: combine(
            timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            formatPrint
          ),
        }),

        new winston.transports.DailyRotateFile({
          dirname: __dirname + "/logs",
          level: "error",
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH-mm",
          // save log files in gzip format
          zippedArchive: true,
          // when file size is greater than 20mb, it will create a new file
          maxSize: "1m",
          // when file is older than 14 days, it will create a new file
          maxFiles: "14d",
          format: combine(
            timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            formatPrint
          ),
        }),
      ],
    });
  }

  commonParams(params: any) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params.context;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId ?? "unknown";
    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message: string, params: any) {
    const paramLog = this.commonParams(params);
    const logObj = Object.assign({ message }, paramLog);
    this.logger.info(logObj);
  }

  error(message: string, params: any) {
    const paramLog = this.commonParams(params);
    const logObj = Object.assign({ message }, paramLog);
    this.logger.error(logObj);
  }
}

export default new WinstonLogger();
