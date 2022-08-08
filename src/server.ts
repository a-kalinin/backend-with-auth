import 'dotenv/config';
import { Server } from 'http';
import app from './app';

let server: Server;

(async () => {
  const { PORT = 5004 } = process.env;

  server = app.listen(PORT, () => {
    console.info(`${'-'.repeat(50)}\n   Application is listening on port ${PORT}\n${'-'.repeat(50)}`);
  });
})().catch((err) => {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
});
