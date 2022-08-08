import 'dotenv/config';
import express from 'express';
import errorHandlerMiddleware from '../middleware/errorHandlerMiddleware';

const app = express();
let exists = false;

export default async function getApp() {
  if (exists) {
    return getApp;
  }
  exists = true;
  app.use(errorHandlerMiddleware);

  return app;
}
