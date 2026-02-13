// types/map/map-mode.types.ts

import type { Bounds, Coordinates } from '../common/api.types';

/**
 * 지도 모드
 */
export type MapMode =
    | { type: 'BOUNDS'; bounds: Bounds } // 영역 내 매장
    | { type: 'SEARCH'; query: string } // 검색 결과
    | { type: 'DETAIL'; storeId: number } // 상세보기
    | { type: 'NEARBY'; lat: number; lng: number }; // 주변 매장

/**
 * 지도 뷰 상태
 */
export interface MapViewState {
    mode: MapMode;
    center: Coordinates;
    zoom: number;
}
