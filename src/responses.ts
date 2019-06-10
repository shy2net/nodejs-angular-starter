import { ActionResponse } from '../shared/models';

export function getOkayResponse(data?: any) {
  return {
    status: 'ok',
    data: data
  } as ActionResponse<any>;
}

export function getErrorResponse(error: any) {
  return {
    status: 'error',
    error: error
  } as ActionResponse<any>;
}

// FIXME: Remove this file as it is not required!