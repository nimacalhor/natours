class AppError extends Error {
  readonly status: "fail" | "error";
  readonly isOperational: boolean;
  readonly value: any;
  readonly path: any;
  readonly code: any;
  readonly errmsg: any;

  constructor(message: string, readonly statusCode: number = 500, error?: any) {
    super(message);
    this.status = this.statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);

    if (error) {
      const { name, path, value, code, errmsg } = error;
      this.name = name ? name : this.name;
      this.path = path;
      this.value = value;
      this.code = code;
      this.errmsg = errmsg;
    }
  }
}

export default AppError;
