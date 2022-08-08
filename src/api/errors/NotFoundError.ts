import ApiError from './ApiError';
import ErrorCodeEnum from '../../@types/ErrorCodeEnum';

class NotFoundError extends ApiError {
  entityName: string;

  constructor(entityName: string) {
    super(
      ErrorCodeEnum.NOT_FOUND,
      `The ${entityName} not found`,
    );
    this.entityName = entityName;
  }
}

export default NotFoundError;
