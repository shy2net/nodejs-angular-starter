import { Controller, Get, PathParams, QueryParams } from '@tsed/common';

@Controller('/api')
export class ApiController {
  @Get('/test')
  test(): string {
    return 'This is a test';
  }

  @Get('/say-something')
  saySomething(@QueryParams('whatToSay') whatToSay: string) {
    return whatToSay;
  }
}
