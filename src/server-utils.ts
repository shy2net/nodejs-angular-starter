/**
 * Converts a middleware into a promise, for easier usage with tS.ED framework.
 * @param middlewareFunc
 * @param req
 * @param res
 */
export function middlewareToPromise(middlewareFunc: (req, res, next) => void, req, res?): Promise<any> {
  return new Promise((resolve, reject) => {
    middlewareFunc(req, res, err => {
      if (err) throw err;
      resolve();
    });
  });
}
