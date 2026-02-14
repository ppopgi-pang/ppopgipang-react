// import { useMapLocation } from '@/hooks/map/use-map-location';
// import { memo, useCallback } from 'react';
// import { InteractiveMap } from './interactive-map';
// import UserLocationMarker from './markers/user-location-marker';
// import RefetchStoreButton from './refetch-stores-button';
// import { ZINDEX } from '@/constants/z-index';
// import type { StoreInBounds } from '@/types/store/store.types';
// import StoreMarkers from './store-markers';

// interface MapContainerProps {
//     stores: StoreInBounds[];
//     updateBounds: (map: kakao.maps.Map) => void;
//     isStale: boolean;
//     onRefetchStore: () => void;
//     onMapCreate?: (map: kakao.maps.Map) => void;
// }

// function MapContainerComponent({
//     stores,
//     updateBounds,
//     isStale,
//     onRefetchStore,
//     onMapCreate,
// }: MapContainerProps) {
//     const { userCoordinates, mapCenter, setMapInstance } = useMapLocation();

//     const handleChangeBounds = useCallback(
//         (map: kakao.maps.Map) => {
//             updateBounds(map);
//         },
//         [updateBounds]
//     );

//     const handleMapCreate = useCallback(
//         (map: kakao.maps.Map) => {
//             setMapInstance(map);
//             // onCreate는 Kakao Map 초기화 도중 동기 호출되므로,
//             // setState를 다음 마이크로태스크로 미뤄 중첩 업데이트 에러 방지
//             queueMicrotask(() => {
//                 updateBounds(map);
//                 onMapCreate?.(map);
//             });
//         },
//         [setMapInstance, updateBounds, onMapCreate]
//     );

//     return (
//         <div className="w-full h-full" style={{ zIndex: ZINDEX.mapOverlay }}>
//             <InteractiveMap
//                 center={mapCenter}
//                 minLevel={1}
//                 maxLevel={5}
//                 onBoundsChanged={handleChangeBounds}
//                 onCreate={handleMapCreate}
//             >
//                 <RefetchStoreButton isVisible={isStale} onRefetchStore={onRefetchStore} />

//                 {/* 사용자 위치 마커 */}
//                 {userCoordinates && <UserLocationMarker position={userCoordinates} />}

//                 {/* 매장 마커들 */}
//                 <StoreMarkers stores={stores} />
//             </InteractiveMap>
//         </div>
//     );
// }

// export const MapContainer = memo(MapContainerComponent);
