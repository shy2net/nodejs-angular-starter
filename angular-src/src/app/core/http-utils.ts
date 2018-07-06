export function appendDisableToastHeaders(headers: any = {}) {
  headers['DisableErrorToast'] = 'True';
  return headers;
}
