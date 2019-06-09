import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';

const bodyParser = require('body-parser');
const compress = require('compression');
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ['application/json']
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  $onMountingMiddlewares(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(compress({}))
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );

    return null;
  }
}
