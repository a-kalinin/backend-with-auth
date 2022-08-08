import NotFoundError from '../api/errors/NotFoundError';

export default function notFoundRouterMiddleware() {
  throw new NotFoundError('endpoint');
}
