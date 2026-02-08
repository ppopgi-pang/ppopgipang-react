import { useState, useEffect, useCallback } from "react";
import { DEFAULT_LOCATION } from "./use-user-location";

/**
 * 좌표
 * - `lat`: 위도
 * - `lng`: 경도
 */
interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * 지도에서의 위치 정보
 * - `currentPosition`: 사용자의 실제 현재 위치
 * - `selectedPosition`: 사용자가 지도에서 선택한 위치
 * - `address`: 선택된 위치의 주소
 */
interface LocationState {
  currentPosition: Coordinates | null;
  selectedPosition: Coordinates | null;
  address: string;
}

/**
 * 현재 지도의 상태
 * - `isDragging`: 지금 지도를 드래그하고 있는지
 * - `hasAdjusted`: 사용자가 위치를 한 번이라도 조정했는지
 */
interface UIState {
  isDragging: boolean;
  hasAdjusted: boolean;
  isLoading: boolean;
}

export function useLocationPicker() {
  // 처음: 위치 정보 없는 상태
  const [locationState, setLocationState] = useState<LocationState>({
    currentPosition: null,
    selectedPosition: null,
    address: "",
  });

  // 처음: 드래그 x, 위치 조정 x
  const [uiState, setUIState] = useState<UIState>({
    isDragging: false,
    hasAdjusted: false,
    isLoading: true,
  });

  // const [isLoading, setIsLoading] = useState(true);

  // 초기 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 성공 콜백
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // 현재 사용자의 실제 위치 저장 / 선택 장소로 설정
          setLocationState({
            currentPosition: coords,
            selectedPosition: coords,
            address: "",
          });
          getAddressFromCoords(coords);
          setUIState((prev) => ({ ...prev, isLoading: false }));
        },
        (error) => {
          // 에러 콜백
          console.error("위치 정보를 가져올 수 없습니다:", error);

          const defaultCoords = DEFAULT_LOCATION;
          setLocationState({
            currentPosition: defaultCoords,
            selectedPosition: defaultCoords,
            address: "",
          });
          getAddressFromCoords(defaultCoords);
          setUIState((prev) => ({ ...prev, isLoading: false }));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // 좌표를 주소로 변환하는 함수
  const getAddressFromCoords = useCallback((coords: Coordinates) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 카카오 맵의 Geocoder 서비스

    // 경도, 위도를 주소로 변환하는 API 호출
    geocoder.coord2Address(coords.lng, coords.lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        const address = result[0].address.address_name;
        setLocationState((prev) => ({
          ...prev,
          address,
        }));
      }
    });
  }, []);

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(() => {
    setUIState((prev) => ({
      ...prev,
      isDragging: true,
    }));
  }, []);

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (map: kakao.maps.Map) => {
      const latlng = map.getCenter(); // 지도의 중심 좌표

      const newPosition = {
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      };

      // 지도의 중심 좌표를 selectedPosition에 저장
      setLocationState((prev) => ({
        ...prev,
        selectedPosition: newPosition,
      }));

      setUIState({
        isLoading: false,
        isDragging: false,
        hasAdjusted: true,
      });

      getAddressFromCoords(newPosition); // 새 위치의 주소 갖고 오기
    },
    [getAddressFromCoords],
  );

  return {
    ...locationState,
    ...uiState,
    handleDragStart,
    handleDragEnd,
  };
}
