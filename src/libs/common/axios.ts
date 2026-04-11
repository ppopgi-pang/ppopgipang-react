import { API_ENDPOINTS } from '@/constants/api';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
});

// 로그 스킵용 (request interceptor)
const NO_LOG_URLS = ['/auth/refresh'];

// 401 발생 시 토큰 갱신을 시도하지 않을 URL 목록
// - /auth/refresh: 갱신 자체 엔드포인트
// - /users/me: 인증 상태 확인 전용 (401 = 비로그인 의미, 갱신 대상 아님)
const SKIP_REFRESH_URLS = ['/auth/refresh'];

const isNoLogUrl = (url?: string) => {
    if (!url) return false;
    return NO_LOG_URLS.some((u) => url.includes(u));
};

const shouldSkipRefresh = (url?: string) => {
    if (!url) return false;
    return SKIP_REFRESH_URLS.some((u) => url.includes(u));
};

let refreshTokenPromise: Promise<void> | null = null;

let refreshFailCount = 0;
const MAX_REFRESH_RETRIES = 3;

const refreshAccessToken = async (): Promise<void> => {
    if (refreshTokenPromise) {
        return refreshTokenPromise;
    }

    // 최대 재시도 횟수 초과 시 즉시 로그아웃
    if (refreshFailCount >= MAX_REFRESH_RETRIES) {
        refreshFailCount = 0;
        throw new Error('Maximum refresh retries exceeded');
    }

    refreshTokenPromise = (async () => {
        const url = (import.meta.env.VITE_API_URL || 'https://api.ppopgi.me/api/v1') + API_ENDPOINTS.AUTH.REFRESH;
        try {
            await axios.post(url, {}, { withCredentials: true });

            // 성공 시 카운터 리셋
            refreshFailCount = 0;
        } catch (error) {
            refreshFailCount++;
            throw error;
        } finally {
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
};

// Request Interceptor
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        if (import.meta.env.DEV && !isNoLogUrl(config.url)) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(
                `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
                response.status,
            );
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // 401 에러 처리
        // shouldSkipRefresh 대상(예: /users/me)은 토큰 갱신 없이 그대로 reject
        // → use-me.ts에서 401을 "비로그인"으로 처리하는 로직이 정상 동작
        if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh(originalRequest.url)) {
            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                return api(originalRequest);
            } catch (refreshError) {
                // 리다이렉트 없이 토큰 만료 이벤트만 발행
                // → AuthProvider에서 수신해 비로그인 상태로 전환
                window.dispatchEvent(new Event('auth:token-expired'));
                return Promise.reject(refreshError);
            }
        }

        if (import.meta.env.DEV) {
            console.error(`[API Error] ${error.response?.status}`, error.message);
        }

        return Promise.reject(error);
    },
);

export default api;
