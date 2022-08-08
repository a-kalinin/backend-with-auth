import { RESPONSE_STATUS } from '../const/response';
import { stringLiteralArray } from './string';

const responseStatuses = stringLiteralArray(Object.values(RESPONSE_STATUS));
export type ResponseStatusT = typeof responseStatuses[number]

export type APIResponseT = {
  status: ResponseStatusT,
  content?: unknown,
  error?: string,
};

//
// export type ErrorResponseT = {
//   error: '',
//   message?: string,
//   details?: Record<string, any>,
// };
