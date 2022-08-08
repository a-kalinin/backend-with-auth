import 'dotenv/config';
import url from 'url';
import express, { Express, Router } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import loggerMiddleware from './middleware/loggerMiddleware';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import notFoundRouteMiddleware from './middleware/notFoundRouterMiddleware';
import { RegisterRoutes } from './tsoa_generated_files/generated_routes';

const {
  NODE_ENV,
  SESSION_SECRET,
  PORT,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;
const app: Express = express();

const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
delete directives['form-action'];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives,
  },
}));
app.use(session({
  secret: SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  proxy: NODE_ENV === 'production',
  name: 'connectApp.sid',
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: NODE_ENV === 'production',
    maxAge: Number(JWT_REFRESH_EXPIRES_IN) * 1000,
  },
}));

if (NODE_ENV === 'production') {
  app.enable('trust proxy');
  // provider.proxy = true;

  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else if (req.method === 'GET' || req.method === 'HEAD') {
      res.redirect(url.format({
        protocol: 'https',
        host: req.get('host'),
        pathname: req.originalUrl,
      }));
    } else {
      res.status(400).json({
        error: 'invalid_request',
        error_description: 'do yourself a favor and only use https',
      });
    }
  });
} else if (NODE_ENV === 'development') {
  /** Logger */
  app.use(loggerMiddleware({
    disabled: true,
    // TODO check it works, cookies are printed
    reqHeaders: false,
    params: false,
    // response: false,
  }));

  /** Swagger documentation endpoint */
  const apiEndpoint = '/api/docs';
  app.use(apiEndpoint, swaggerUi.serve, async (req, res) => res.send(
    swaggerUi.generateHTML((await import('./tsoa_generated_files/swagger.json'))?.default),
  ));
  console.info(`***** Swagger docs published on http://localhost:${PORT}${apiEndpoint} *****`);
}

const router = Router();
RegisterRoutes(router);
app.use('/api', router);

app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

export default app;
