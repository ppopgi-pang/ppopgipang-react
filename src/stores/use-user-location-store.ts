import { create } from 'zustand';
import type { Coordinates } from '@/types/map/map.types';

interface UserLocationState {
    coordinates: Coordinates | null;
    /** 최초 조회 중 (coordinates === null) — 전체 화면 블로킹 스피너용 */
    isLoading: boolean;
    /** 백그라운드 리페치 중 (coordinates !== null) — 버튼 아이콘 애니메이션용 */
    isRefetching: boolean;
    error: string | null;

    /** 위치 조회 (최초 진입 또는 수동 재조회 시 호출) */
    fetchLocation: () => void;
}

export const useUserLocationStore = create<UserLocationState>((set) => ({
    coordinates: null,
    isLoading: false,
    isRefetching: false,
    error: null,

    fetchLocation: () => {
        if (!navigator.geolocation) {
            set({ error: '이 브라우저는 위치 서비스를 지원하지 않아요.', isLoading: false, isRefetching: false });
            return;
        }

        set((state) => ({
            // 기존 좌표 없음 → 초기 로딩 (UI 블로킹)
            // 기존 좌표 있음 → 백그라운드 리페치 (지도 유지, 버튼만 로딩)
            isLoading: state.coordinates === null,
            isRefetching: state.coordinates !== null,
            error: null,
        }));

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                set({
                    coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
                    isLoading: false,
                    isRefetching: false,
                    error: null,
                });
            },
            (err) => {
                set({
                    // 리페치 실패 시 기존 좌표 유지 — coordinates 덮어쓰지 않음
                    error: err.message,
                    isLoading: false,
                    isRefetching: false,
                });
            },
        );
    },
}));

export const useUserCoordinates = () => useUserLocationStore((s) => s.coordinates);
export const useUserLocationIsLoading = () => useUserLocationStore((s) => s.isLoading);
export const useUserLocationIsRefetching = () => useUserLocationStore((s) => s.isRefetching);
export const useUserLocationError = () => useUserLocationStore((s) => s.error);
export const useFetchLocation = () => useUserLocationStore((s) => s.fetchLocation);

/** 모든 위치 상태를 함께 필요로 하는 컴포넌트용 facade */
export const useUserLocation = () => ({
    coordinates: useUserCoordinates(),
    isLoading: useUserLocationIsLoading(),
    isRefetching: useUserLocationIsRefetching(),
    error: useUserLocationError(),
    fetchLocation: useFetchLocation(),
});
