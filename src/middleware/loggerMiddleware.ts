export interface ILoggerOptions {
  disabled?: boolean;
  reqHeaders?: boolean;
  params?: boolean;
  response?: boolean;
}

export default function loggerMiddleware(options: ILoggerOptions = {}) {
  const defaults: ILoggerOptions = {
    disabled: false,
    reqHeaders: true,
    params: true,
    response: true,
  };

  const mergedOptions = {
    ...defaults,
    ...options,
  };

  return function loggerFn(req, res, next) {
    if (options.disabled) {
      next();
      return;
    }

    console.info('---------------------------------');
    console.info('REQUEST:', req.method, req.path);
    if (mergedOptions.reqHeaders) {
      console.info('HEADERS', {
        ...req.headers,
        ...(
          req.headers.cookie
            // TODO check it works, cookies are printed
            ? { cookie: new URLSearchParams(req.headers.cookie).entries() }
            : {}
        ),
      });
    }
    if (mergedOptions.params) {
      // TODO check it works, query is printed
      console.info('QUERY', new URL(req.url).searchParams.entries());
      console.info('BODY', req.body);
    }

    // const ignored = [
    //   'socket',
    //   'client',
    //   'next',
    //   'res',
    // ];
    // const r = Object.keys(req)
    //   .filter((key) => !key.startsWith('_'))
    //   .filter((key) => !ignored.includes(key))
    //   .reduce((acc, key) => ({ ...acc, [key]: req[key] }), {});
    // console.log(r);

    if (mergedOptions.response) {
      const oldWrite = res.write;
      const oldEnd = res.end;

      const chunks: any[] = [];

      res.write = function responseWrite(chunk, ...rest) {
        chunks.push(Buffer.from(chunk));

        return oldWrite.call(res, chunk, ...rest);
      };

      res.end = function responseEnd(chunk, ...rest) {
        if (chunk) chunks.push(Buffer.from(chunk));

        const body = Buffer.concat(chunks).toString('utf8');
        console.info('---------------------------------');
        console.info('RESPONSE:', req.method, req.path);
        let bodyLog = body;
        try {
          bodyLog = JSON.parse(body);
        } catch (err) {
          // nothing
        }
        console.info('BODY', bodyLog);
        console.info('--------------------------------- END RESPONSE');

        oldEnd.call(res, chunk, ...rest);
      };
    }

    next();
  };
}
