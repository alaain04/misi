export type ErrorResponse = {
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
};
