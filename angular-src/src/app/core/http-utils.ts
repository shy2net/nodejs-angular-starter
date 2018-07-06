export function getDisableToastOptions(options: any = {}): any {
  const headers = options.headers || {};
  headers['DisableErrorToast'] = 'True';
  options['headers'] = headers;

  return options;
}
