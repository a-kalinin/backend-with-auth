import ApiError from './ApiError';
import ErrorCodeEnum from '../../@types/ErrorCodeEnum';

class EntityExistsError extends ApiError {
  entityName: string;

  fieldName: string;

  value?: string | Error;

  constructor(entityName: string, fieldName: string, value?: string | Error) {
    super(
      ErrorCodeEnum.ENTITY_EXISTS,
      `The ${entityName} with same ${fieldName}${value !== undefined ? `: "${value}"` : ''} already exists.`,
    );
    this.entityName = entityName;
    this.fieldName = fieldName;
    this.value = value;
  }
}

export default EntityExistsError;
