// import { useState, useMemo, useCallback, useRef } from 'react';
// import useGeolocation, { DEFAULT_LOCATION } from '@/hooks/map/use-user-location';
// import type { Coordinates } from '@/types/map/map.types';

// /**
//  * 지도 위치 관리 (사용자 위치 + 수동 이동)
//  */
// export function useMapLocation() {
//     const {
//         isLoading: isLoadingLocation,
//         coordinates: userCoordinates,
//         heading,
//         accuracy,
//         error: locationError,
//     } = useGeolocation({
//         watch: true,
//         enableHighAccuracy: true,
//     });

//     const [manualCenter, setManualCenter] = useState<Coordinates | null>(null);
//     const mapInstanceRef = useRef<kakao.maps.Map | null>(null);

//     const mapCenter = useMemo(() => {
//         if (manualCenter) return manualCenter;
//         if (userCoordinates && !isLoadingLocation && !locationError) {
//             return userCoordinates;
//         }
//         return DEFAULT_LOCATION;
//     }, [manualCenter, userCoordinates, isLoadingLocation, locationError]);

//     const setMapInstance = useCallback((map: kakao.maps.Map) => {
//         mapInstanceRef.current = map;
//     }, []);

//     const resetToUserLocation = useCallback(() => {
//         setManualCenter(null);

//         // 지도 인스턴스가 있고 사용자 위치가 있으면 부드럽게 이동
//         if (mapInstanceRef.current && userCoordinates) {
//             const moveLatLon = new kakao.maps.LatLng(userCoordinates.lat, userCoordinates.lng);
//             mapInstanceRef.current.panTo(moveLatLon);
//         }
//     }, [userCoordinates]);

//     const moveToLocation = useCallback((coordinates: Coordinates) => {
//         setManualCenter(coordinates);

//         // 지도 인스턴스가 있으면 부드럽게 이동
//         if (mapInstanceRef.current) {
//             const moveLatLon = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
//             mapInstanceRef.current.panTo(moveLatLon);
//         }
//     }, []);

//     return {
//         // 상태
//         isLoadingLocation,
//         locationError,

//         // 데이터
//         userCoordinates,
//         mapCenter,
//         heading,
//         accuracy,

//         // 액션
//         resetToUserLocation,
//         moveToLocation,
//         setMapInstance,
//     };
// }
