"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  BADREQUEST: 400,
};

const ResponseMessage = {
  FORBIDDEN: "Forbidden error",
  CONFLICT: "Conflict Request Error",
  UNAUTHORIZED: "Unauthorized",
  BADREQUEST: "Bad Request",
};

class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(
    message: string = ResponseMessage.CONFLICT,
    statusCode: number = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = ResponseMessage.BADREQUEST,
    statusCode: number = StatusCode.BADREQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string = ResponseMessage.UNAUTHORIZED,
    statusCode: number = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
