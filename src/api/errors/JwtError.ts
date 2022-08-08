import ApiError from './ApiError';
import ErrorCodeEnum from '../../@types/ErrorCodeEnum';

class JwtError extends ApiError {
  details: Record<string, unknown>;

  constructor(code: ErrorCodeEnum, details: Record<string, unknown>, message?: string) {
    super(code, message);
    this.details = details;
  }
}

export default JwtError;
