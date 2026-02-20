import { create } from 'zustand';
import type { Coordinates } from '@/types/map/map.types';

// 매장 선택에 필요한 최소 정보
interface SelectableStore {
    id: number;
    latitude: number;
    longitude: number;
}

interface MapState {
    // 선택된 매장 ID (null이면 선택 없음)
    selectedStoreId: number | null;
    // 지도 중심 좌표 (null이면 사용자 위치 사용)
    centerCoordinates: Coordinates | null;
    // 지도 바운더리 변경 여부 (재검색 버튼 표시 여부)
    isBoundsChanged: boolean;

    // 매장 선택/해제 토글 (선택 시 지도 중심도 함께 이동)
    selectStore: (store: SelectableStore) => void;
    // 선택 초기화
    clearSelection: () => void;
    // 지도 중심 좌표 직접 설정
    setCenterCoordinates: (coords: Coordinates | null) => void;
    // 지도 이동 여부 설정
    setIsBoundsChanged: (changed: boolean) => void;
    // 맵 페이지 진입 시 상태 초기화
    reset: () => void;
}

export const useMapStore = create<MapState>((set) => ({
    selectedStoreId: null,
    centerCoordinates: null,
    isBoundsChanged: false,

    selectStore: (store) =>
        set((state) => {
            // 이미 선택된 매장 클릭 시 선택 해제
            if (state.selectedStoreId === store.id) {
                return { selectedStoreId: null };
            }
            // 새 매장 선택 시 지도 중심도 해당 매장으로 이동
            return {
                selectedStoreId: store.id,
                centerCoordinates: { lat: store.latitude, lng: store.longitude },
            };
        }),

    clearSelection: () => set({ selectedStoreId: null }),
    setCenterCoordinates: (coords) => set({ centerCoordinates: coords }),
    setIsBoundsChanged: (changed) => set({ isBoundsChanged: changed }),
    reset: () => set({ selectedStoreId: null, centerCoordinates: null, isBoundsChanged: false }),
}));

// 개별 선택자 — 필요한 상태만 구독해서 불필요한 리렌더링 방지
export const useSelectedStoreId = () => useMapStore((s) => s.selectedStoreId);
export const useCenterCoordinates = () => useMapStore((s) => s.centerCoordinates);
export const useIsBoundsChanged = () => useMapStore((s) => s.isBoundsChanged);
