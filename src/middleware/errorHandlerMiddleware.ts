// import JsonWebTokenError from 'jsonwebtoken/lib/JsonWebTokenError';
// import NotBeforeError from 'jsonwebtoken/lib/NotBeforeError';
// import TokenExpiredError from 'jsonwebtoken/lib/TokenExpiredError';
import { ValidateError } from 'tsoa';
import NotFoundError from '../api/errors/NotFoundError';
import EntityExistsError from '../api/errors/EntityExistsError';
import ApiError from '../api/errors/ApiError';
import JwtError from '../api/errors/JwtError';
import UnauthorizedError from '../api/errors/UnauthorizedError';

export enum Errors {
  'Unauthorized' = 401,
  'NotFound' = 404,
  'Conflict' = 409,
  'UnprocessableEntity' = 422,
  'Internal' = 500,
}

export default function errorHandlerMiddleware(err, req, res, next) {
  console.error(err.message);
  console.error(err.stack);

  if (err instanceof ValidateError) {
    res.status(Errors.UnprocessableEntity).json({
      error: 'Validation Failed',
      details: err?.fields,
    });
    return;
  }

  if (err instanceof JwtError) {
    res.status(Errors.Unauthorized).json({
      error: 'Token Error',
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(Errors.NotFound).json({
      error: 'Not found',
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof EntityExistsError) {
    res.status(Errors.Conflict).json({
      error: 'Conflict',
      message: err.message,
      code: err.code,
      details: {
        entity: err.entityName,
        field: err.fieldName,
        value: err.value,
      },
    });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(Errors.Unauthorized).json({
      error: 'Unauthorized',
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(Errors.Internal).json({
      error: 'Internal Error',
      message: err.message,
      code: err.code,
      raw: err.raw,
    });
    return;
  }

  res.status(500).send({ error: 'Internal Server Error', details: err.message });
  next(err);
  // if (req.xhr) {
  //   res.status(500).send({ error: 'Something failed!', errorMessage: err.message });
  // } else {
  //   next(err);
  // }
}
