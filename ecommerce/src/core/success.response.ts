"use strict";

import { Response } from "express";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ResponseMessage = {
  OK: "Success",
  CREATED: "Created",
};

interface SuccessResponseParams {
  message?: string;
  statusCode?: number;
  metadata?: any;
  responseStatusCode?: string;
}

class SuccessResponse {
  message: string;
  statusCode: number;
  metadata: any;

  constructor({
    message,
    statusCode = StatusCode.OK,
    metadata = {},
    responseStatusCode = ResponseMessage.OK,
  }: SuccessResponseParams) {
    this.message = responseStatusCode ? responseStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  sendResponse(res: Response, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }: SuccessResponseParams) {
    super({ message, metadata });
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = StatusCode.CREATED,
    responseStatusCode = ResponseMessage.CREATED,
  }: SuccessResponseParams) {
    super({ message, statusCode, metadata, responseStatusCode });
  }
}
