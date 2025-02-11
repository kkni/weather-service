import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";


interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
  config: CustomAxiosRequestConfig;
}

// https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Canada%2CThetford-Mines/2025-02-03/2025-02-03?
// unitGroup=metric&
// elements=datetime,datetimeEpoch,name,address,tempmax,tempmin,temp,humidity,conditions,icon&
// include=days&
// key=U9CKYP6Y4HF6L2863RRMLD546&contentType=json

const apiClient = axios.create({
  baseURL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services',
  timeout: 5000,
  params: {
    key : 'U9CKYP6Y4HF6L2863RRMLD546',
    elements : 'datetime,datetimeEpoch,name,address,tempmax,tempmin,temp,humidity,conditions,icon',
    include : 'days',
    unitGroup : "metric"
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  config.metadata = { startTime: new Date() }; // 요청 시작 시간 기록
  console.log(config.url)
//   logger.debug(`Axios : [Request] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: CustomAxiosResponse) => {
    const duration =
      new Date().getTime() - response.config.metadata!.startTime.getTime();
    // logger.debug(
    //   `Axios : [Response] ${response.config.url} - Status: ${response.status} - Duration: ${duration}ms`
    // );
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime
      ? new Date().getTime() - error.config.metadata.startTime.getTime()
      : 0;
    // logger.debug(
    //   `Axios : [Error] ${error.config?.url} - Status: ${error.response?.status} - Duration: ${duration}ms`
    // );

    if (error.response) {
      const modifiedResponse = {
        status: 400, // 강제로 400 상태 코드 설정
        data: {
          error: error.response.status,
          message: error.response.data.message || 'Something went wrong!',
          originalStatus: error.response.status, // 원래 상태 코드 저장
        },
      };
      return Promise.resolve(modifiedResponse); // 에러 대신 수정된 응답 반환
    }
    
    const networkErrorResponse = {
      status: 400,
      data: {
        // error: ErrorCodes.DSG_ERROR.response,
      },
    };

    return Promise.resolve(networkErrorResponse);
  }
);

export default apiClient;