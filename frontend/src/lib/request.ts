import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  error?: string;
}

const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      withCredentials: true,
      ...config,
    });

    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error: any) {
    return {
      data: error.response?.data,
      status: error.response?.status || 500,
      success: false,
      error: error.message,
    };
  }
};
