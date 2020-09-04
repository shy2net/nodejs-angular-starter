import { Filter, IFilter, ParseService, UseFilter } from '@tsed/common';

@Filter()
export class RequestUserFilter implements IFilter {
  constructor(private parseService: ParseService) {}

  transform(expression: string, request: unknown): unknown {
    return this.parseService.eval(expression, request['user']);
  }
}

/**
 * Returns the authenticated user (extracted from the request.user object).
 */
export function RequestUser(): ParameterDecorator {
  return UseFilter(RequestUserFilter);
}
