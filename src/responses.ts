import { ActionResponse } from '../shared/models';

export function getOkayResponse<T>(data?: unknown): ActionResponse<T> {
  return {
    status: 'ok',
    data: data,
  } as ActionResponse<T>;
}

export function getErrorResponse(error: unknown): ActionResponse<void> {
  return {
    status: 'error',
    error: error,
  } as ActionResponse<void>;
}

// FIXME: Remove this file as it is not required!
