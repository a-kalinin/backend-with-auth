import ErrorCodeEnum from '../../@types/ErrorCodeEnum';

class ApiError extends Error {
  code: ErrorCodeEnum;

  raw?: Error;

  constructor(code: ErrorCodeEnum, message?: string, rawError?: Error) {
    super(message || code);
    this.code = code;
    this.raw = rawError;
  }
}

export default ApiError;
