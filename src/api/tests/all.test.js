import request from 'supertest';
// eslint-disable-next-line import/no-unresolved
import app from '../../app.js';
// eslint-disable-next-line import/no-unresolved
import { getDirnameForEndpointTest } from '../../utils/common.js';

const endpoint = getDirnameForEndpointTest(import.meta.url);
describe('Test the root path', () => {
  test('It should response the GET method', () => request(app)
    .get(endpoint)
    .expect(200)
    .expect('Content-Type', /text\/html/)
    .expect('Welcome!')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Welcome!');
    }));
});
