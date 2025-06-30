import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  errorData?: ApiErrorData[];
}

export interface ApiErrorData {
  campo: string;
  campo_enfocar: string;
  codigo_estado: string;
  id_registro: string;
  mensaje: string;
}

export interface ApiResponseError {
  data: ApiErrorData[];
  status: number;
  statusText: string;
}

export interface ApiError extends Error {
  message: string;
  status?: number;
  response?: {
    data: ApiErrorData[];
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  };
}

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private defaultPrograma: string;

  private constructor() {
    this.defaultPrograma = '0';
    this.axiosInstance = axios.create({
      baseURL: '/',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (config.params) {
          config.params.programa = this.defaultPrograma;
        } else {
          config.params = { programa: this.defaultPrograma };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Método para cambiar el programa por defecto
  public setDefaultPrograma(programa: string): void {
    this.defaultPrograma = programa;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.axiosInstance.request(config);

      if (response.data.length > 0 && response.data[0].codigo_estado === '400') {
        const errorData = response.data as ApiErrorData[];
        return {
          data: {} as T,
          error: errorData[0].mensaje,
          errorData: errorData,
          message: errorData[0].mensaje,
          success: false
        };
      }

      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      const apiError = error as ApiError;
      const errorData = apiError.response?.data as ApiErrorData[];
      return {
        data: {} as T,
        error: errorData?.[0]?.mensaje || apiError.message,
        errorData: errorData,
        success: false
      };
    }
  }

  public async get<T>(url: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      params,
      url,
    });
  }

  public async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({
      data,
      method: 'POST',
      url,
    });
  }

  public async put<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>({
      data,
      method: 'PUT',
      url,
    });
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }
}
