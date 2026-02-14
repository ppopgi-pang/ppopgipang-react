// import { useState, useCallback } from 'react';
// import type { Bounds } from '@/types/common/api.types';
// import type { MapMode } from '@/types/map/map.mode.type';

// /**
//  * 지도 표시 모드 관리
//  */
// export function useMapMode(initialBounds: Bounds | null = null) {
//     const [mode, setMode] = useState<MapMode>(
//         initialBounds
//             ? { type: 'BOUNDS', bounds: initialBounds }
//             : { type: 'BOUNDS', bounds: { north: 0, south: 0, east: 0, west: 0 } }
//     );

//     // 영역 내 매장 모드
//     const showStoresInBounds = useCallback((bounds: Bounds) => {
//         setMode({ type: 'BOUNDS', bounds });
//     }, []);

//     // 검색 모드
//     const showSearchResults = useCallback((query: string) => {
//         setMode({ type: 'SEARCH', query });
//     }, []);

//     // 상세보기 모드
//     const showStoreDetail = useCallback((storeId: number) => {
//         setMode({ type: 'DETAIL', storeId });
//     }, []);

//     // 주변 매장 모드
//     const showNearbyStores = useCallback((lat: number, lng: number) => {
//         setMode({ type: 'NEARBY', lat, lng });
//     }, []);

//     return {
//         mode,
//         showStoresInBounds,
//         showSearchResults,
//         showStoreDetail,
//         showNearbyStores,
//     };
// }
