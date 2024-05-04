class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = "",
    stack = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.errors = errors.concat(message);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      errors: this.errors,
      stack: this.stack,
    };
  }
}

export{ApiError}