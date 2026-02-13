import type { ApiResponse, Bounds, Coordinates } from '@/types/common/api.types';
import type { StoreInBounds, StoreNearby, StoreSearch } from './store.types';

/**
 * 영역 내 매장 조회 - 요청
 */
export interface GetStoresInBoundsRequest extends Bounds {
    keyword?: string;
    filter?: string;
}

/**
 * 영역 내 매장 조회 - 응답
 */
export type GetStoresInBoundsResponse = ApiResponse<StoreInBounds[]>;

/**
 * 주변 매장 조회 - 요청
 */
export interface GetStoresNearbyRequest extends Coordinates {
    page: number;
    size: number;
    radius?: number; // 미터 단위 (기본값: 1000)
    keyword?: string;
    filter?: 'all' | 'scrapped' | 'popular' | 'recent_cert';
}

/**
 * 주변 매장 조회 - 응답
 */
export type GetStoresNearbyResponse = ApiResponse<StoreNearby[]>;

/**
 * 매장 검색 - 요청
 */
export interface SearchStoresRequest {
    latitude?: number;
    longitude?: number;
    keyword: string;
    page: number;
    size: number;
}

/**
 * 매장 검색 - 응답
 */
export type SearchStoresResponse = ApiResponse<StoreSearch[]>;
