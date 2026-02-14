/**
 * API 응답 공통 구조
 */
export interface ApiResponse<T> {
    data: T;
    meta: ApiMeta;
    success: boolean;
}

/**
 * API 메타 정보
 */
export interface ApiMeta {
    count: number;
}

/**
 * 페이지네이션 메타 정보
 */
export interface PaginationMeta extends ApiMeta {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
}

/**
 * 좌표 정보
 */
export interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * 지도 영역 정보
 */
export interface Bounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

/**
 * 에러 응답
 */
export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}
