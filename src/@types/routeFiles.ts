// import { RequestHandler } from 'express';

export interface IRouteFileOptions extends Record<string, any> {
  path?: string;
  method?: string;
  // callback: RequestHandler[] | RequestHandler,
}
