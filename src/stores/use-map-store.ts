import { create } from 'zustand';
import type { Coordinates } from '@/types/map/map.types';

interface MapState {
    // 선택된 매장 ID (null이면 선택 없음)
    selectedStoreId: number | null;
    /**
     * 지도 pan 대상 좌표.
     * null이면 호출부(MapPage)에서 userLocation으로 폴백.
     * 매장 선택·드래그·위치 재설정 시 호출부에서 명시적으로 set.
     */
    panTarget: Coordinates | null;
    // 지도 바운더리 변경 여부 (재검색 버튼 표시 여부)
    isBoundsChanged: boolean;

    // 매장 선택/해제 토글 — pan은 호출부에서 명시적으로 setPanTarget 처리
    selectStore: (storeId: number) => void;
    // 선택 초기화
    clearSelection: () => void;
    // 지도 pan 대상 좌표 설정
    setPanTarget: (coords: Coordinates | null) => void;
    // 지도 이동 여부 설정
    setIsBoundsChanged: (changed: boolean) => void;
    // 맵 페이지 진입 시 상태 초기화
    reset: () => void;
}

export const useMapStore = create<MapState>((set) => ({
    selectedStoreId: null,
    panTarget: null,
    isBoundsChanged: false,

    selectStore: (storeId) =>
        set((state) => ({
            // 이미 선택된 매장 클릭 시 선택 해제, 아니면 새 매장 선택
            selectedStoreId: state.selectedStoreId === storeId ? null : storeId,
        })),

    clearSelection: () => set({ selectedStoreId: null }),
    setPanTarget: (coords) => set({ panTarget: coords }),
    setIsBoundsChanged: (changed) => set({ isBoundsChanged: changed }),
    reset: () => set({ selectedStoreId: null, panTarget: null, isBoundsChanged: false }),
}));

// 개별 선택자 — 필요한 상태만 구독해서 불필요한 리렌더링 방지
export const useSelectedStoreId = () => useMapStore((s) => s.selectedStoreId);
export const usePanTarget = () => useMapStore((s) => s.panTarget);
export const useIsBoundsChanged = () => useMapStore((s) => s.isBoundsChanged);
