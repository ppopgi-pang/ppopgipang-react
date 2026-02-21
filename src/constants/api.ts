import type { Bounds } from '@/types/common/api.types';
import type { GetImageWithFileNameRequest } from '@/types/common/common.types';

/**
 * API 기본 설정
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'https://api.ppopgi.me/api/v1',
    TIMEOUT: 10000,
} as const;

/**
 * API 엔드포인트
 */
export const API_ENDPOINTS = {
    STORES: {
        BASE: '/stores',
        IN_BOUNDS: '/stores/in-bounds',
        NEARBY: '/stores/nearby',
        SEARCH: '/stores/search',
        DETAIL: (storeId: number) => `/stores/details/${storeId}`,
        SUMMARY: (storeId: number) => `/stores/summary/${storeId}`,
    },

    COMMON: {
        GET_IMAGE: ({ path, fileName }: GetImageWithFileNameRequest) => `/commons/images/${path}/${fileName}`,
        UPLOAD_IMAGE: '/commons/file-uploads',
    },

    REVIEWS: {
        BASE: '/reviews',
        BY_STORE: (storeId: number) => `/stores/reviews/${storeId}`,
        // DETAIL: (id: number) => `/reviews/${id}`,
    },

    USER: {
        // PROFILE: '/user/profile',
        // FAVORITES: '/user/favorites',
    },
} as const;

/**
 * HTTP 메서드
 */
export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
} as const;

/**
 * 쿼리 키
 */
export const QUERY_KEYS = {
    STORES: {
        ALL: ['stores'] as const,
        IN_BOUNDS: (bounds: Bounds) => ['stores', 'in-bounds', bounds] as const,
        NEARBY: (coords: { lat: number; lng: number }) => ['stores', 'nearby', coords] as const,
        SEARCH: (query: string) => ['stores', 'search', query] as const,
        DETAIL: (id: number) => ['stores', 'detail', id] as const,
    },
    REVIEWS: {
        ALL: ['reviews'] as const,
        BY_STORE: (storeId: number) => ['reviews', 'by-store', storeId] as const,
    },
    USER: {
        PROFILE: ['user', 'profile'] as const,
        FAVORITES: ['user', 'favorites'] as const,
    },
} as const;
