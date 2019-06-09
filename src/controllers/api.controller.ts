import { Controller, Get } from '@tsed/common';

@Controller('/calendars')
export class ApiController {
  @Get()
  test(): string {
    return 'This is a test';
  }
}
