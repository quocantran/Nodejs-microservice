"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
};

const ResponseMessage = {
  FORBIDDEN: "Bad Request",
  CONFLICT: "Conflict Request Error",
  UNAUTHORIZED: "Unauthorized",
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
    message: string = ResponseMessage.FORBIDDEN,
    statusCode: number = StatusCode.FORBIDDEN
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
