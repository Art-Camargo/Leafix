import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpStatusCodes } from "./http-status";

let baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  baseURL = "https://plantex-server.onrender.com/";
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RequestConfig<TRequest = unknown>
  extends Omit<AxiosRequestConfig, "url" | "method" | "data"> {
  method: "GET" | "POST";
  url: string;
  data?: TRequest;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandledResponse<T = any> = {
  data: T | null;
  isErr: () => boolean;
  error?: {
    code: number;
    message: string;
  };
};

const buildErrorResponse = (
  code: number,
  message: string
): HandledResponse => ({
  data: null,
  isErr: () => true,
  error: { code, message },
});

const handleResponse = (response: AxiosResponse): HandledResponse => {
  const statusCode = response.status;

  switch (statusCode) {
    case HttpStatusCodes.OK:
    case HttpStatusCodes.Accepted:
      return {
        data: response.data,
        isErr: () => false,
      };

    case HttpStatusCodes.BadRequest:
    case HttpStatusCodes.Unauthorized:
    case HttpStatusCodes.Forbidden:
    case HttpStatusCodes.InternalServerError:
      return buildErrorResponse(
        statusCode,
        response.data?.message || "An error occurred"
      );

    default:
      return buildErrorResponse(
        statusCode,
        `Unexpected status code: ${statusCode} - ${response.statusText}`
      );
  }
};

export const makeRequest = async <TResponse, TRequest = unknown>(
  config: RequestConfig<TRequest>
): Promise<HandledResponse<TResponse>> => {
  try {
    const response: AxiosResponse<TResponse> = await axiosInstance.request({
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers,
    });

    return handleResponse(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const statusCode = error?.response?.status ?? 0;
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Unexpected error occurred";

    return buildErrorResponse(statusCode, message);
  }
};
