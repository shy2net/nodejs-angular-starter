export interface ActionResponse<T> {
  status: string;
  error?: string;
  data?: T;
}
