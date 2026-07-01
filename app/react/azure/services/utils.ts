import { AxiosError } from 'axios';

export function azureErrorParser(axiosError: AxiosError) {
  if (!axiosError.response) {
    const error = new Error('Azure 请求失败');
    return {
      error,
      details: axiosError.message,
    };
  }

  const responseData = axiosError.response.data;
  const message =
    responseData &&
    typeof responseData === 'object' &&
    'error' in responseData &&
    typeof responseData.error === 'string'
      ? responseData.error
      : `Azure 请求失败: ${axiosError.response?.statusText}`;

  return {
    error: new Error(message),
    details: message,
  };
}
